import axios from 'axios';
import {
  PaginateQuery,
  PaginateResponse,
  ServiceResponse,
} from '@tts-dev/common';
import { v4 as uuid } from 'uuid';
import util from 'util';

import { TrainingParadigmDao } from '../daos/training-paradigm-dao';
import client from '../utils/elasticsearch';
import { getEnv } from '../configs/env-config';
import { DNNParadigm } from '../configs/training-config';
import { TrainingStepFinishedPublisher } from '../events/publishers/training-step-finished-publisher';
import { natsWrapper } from '../nats-wrapper';
import { TrainingParadigmDoc } from '../models/training-paradigm';

interface TrainingResponse extends ServiceResponse {
  curTrainingId?: string | null;
}

interface PaginatedTrainingParadigms extends PaginateResponse {
  docs: TrainingParadigmDoc[];
}
interface IsTrainingResponse extends ServiceResponse {
  data?: {
    isTraining: boolean;
    currTrainingId: string | null;
  };
}

interface GetTrainingParadigmsResponse extends ServiceResponse {
  paginatedTrainingParadigms?: PaginatedTrainingParadigms;
}

interface Progress {
  status: 'processing' | 'success' | 'error';
  training_id: string;
  container: string;
  stepUID: number;
  start_time: string;
  name: string;
  total: number;
  current: number;
  percent: number;
  errorMessage?: string;
  steps: {
    name: string;
    total: number;
    current: number;
    percent: number;
  }[];
}

interface TrainingProgressResponse extends ServiceResponse {
  progresses?: (Progress | null)[];
}

const getTrainingStepUIDByName = async (
  stepName: string,
  containerName: string
): Promise<number | null> => {
  if (containerName === 'kaldi') {
    if (stepName.endsWith('prepare_text')) {
      return 1;
    }
    if (stepName.endsWith('prepare_audio')) {
      return 2;
    }
    if (stepName.endsWith('align_phoneme_audio')) {
      return 3;
    }
    if (stepName.endsWith('generate_output')) {
      return 4;
    }

    return null;
  }
  if (containerName === 'merlin') {
    if (stepName.endsWith('prepare_text')) {
      return 5;
    }
    if (stepName.endsWith('prepare_audio')) {
      return 6;
    }
    if (stepName.endsWith('config_params')) {
      return 7;
    }
    if (stepName.endsWith('extract_features')) {
      return 8;
    }
    if (stepName.endsWith('train_duration')) {
      return 9;
    }
    if (stepName.endsWith('train_acoustic')) {
      return 10;
    }
    if (stepName.endsWith('generate_output')) {
      return 11;
    }

    return null;
  }

  return null;
};

const getPercent = (total: number, current: number): number => {
  if (!total) {
    return 100;
  }

  return Math.ceil((current * 100) / total);
};

const getCurrProgress = async (): Promise<Progress[]> => {
  const training_id = await getCurrTrainingId();

  console.log({ training_id });

  if (!training_id) {
    return [];
  }

  const progresses = await getTrainingProgressByTrainingId(training_id);

  return progresses;
};

const getTrainingProgress = async (
  id: string
): Promise<TrainingProgressResponse> => {
  console.log('get training progress');
  const trainingParadigmDao = new TrainingParadigmDao();

  try {
    const activeTrainingParadigm = await trainingParadigmDao.findItem({
      status: 'active',
      curr_training_id: id,
    });
    if (!activeTrainingParadigm) {
      return {
        success: false,
        errors: [{ message: 'Training ID is not valid, please try again' }],
      };
    }

    const progresses = await getTrainingProgressByTrainingId(id);

    return {
      success: true,
      progresses: progresses,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      errors: [{ message: 'Something went wrong while get training progress' }],
    };
  }
};

const getCurrTrainingId = async (): Promise<string | null> => {
  console.log('get cur training id');
  const trainingParadigmDao = new TrainingParadigmDao();

  const activeTrainingParadigm = await trainingParadigmDao.findItem({
    status: 'active',
  });

  console.log({ activeTrainingParadigm });

  if (!activeTrainingParadigm) {
    return null;
  }

  return activeTrainingParadigm.curr_training_id;
};

const getTrainingProgressByTrainingId = async (training_id: string) => {
  const { elasticsearch } = getEnv();

  console.log({ training_id });

  // get group step name
  const groupsRes = await client.search({
    index: elasticsearch.index,
    type: '_doc',
    body: {
      aggs: {
        logs: {
          terms: {
            field: 'json.name',
          },
        },
      },
      _source: ['json'],
    },
  });
  const stepsName = groupsRes.aggregations.logs.buckets.map(
    (bucket: any) => bucket.key
  );

  console.log({ stepsName });

  const result: any[] = await Promise.all(
    stepsName.map(async (st: string) => {
      console.log({ st });
      const res = await client.search({
        index: elasticsearch.index,
        type: '_doc',
        body: {
          size: 2,
          sort: [{ 'json.line_log_number': { order: 'desc' } }],
          query: {
            bool: {
              must: [
                {
                  match: {
                    'json.origin_training_id': training_id,
                  },
                },
                {
                  match: { 'json.name': st },
                },
              ],
            },
          },
          _source: ['json', 'container'],
        },
      });

      console.log(res.hits.hits.length, ' - array response length');
      if (res.hits.hits.length === 0) {
        return {};
      }

      const containerID = (res.hits.hits[0]._source as any).container.id;

      if (res.hits.hits.length === 1) {
        await new TrainingStepFinishedPublisher(natsWrapper.client).publish({
          prevUID: (res.hits.hits[0]._source as any).stepUID,
          training_id: (res.hits.hits[0]._source as any).training_id,
          url: '',
          status: 'error',
        });
        const stepName = (res.hits.hits[0]._source as any).name;
        const stepContainer = containerID;
        const stepUID = getTrainingStepUIDByName(stepName, containerID);

        return {
          status: 'error',
          container: stepContainer,
          training_id: training_id,
          stepUID: stepUID,
          start_time: (res.hits.hits[0]._source as any).start_time,
          name: stepName,
          total: 0,
          current: 0,
          percent: 0,
          steps: [],
          errorMessage: (res.hits.hits[0]._source as any).message,
        };
      }

      const firstSource = (res.hits.hits[0]._source as any).json;
      const secondSource = (res.hits.hits[1]._source as any).json;

      let source;
      let current;
      let status = 'processing';
      let steps = [];
      let errorMessage;

      if (firstSource && firstSource.code) {
        source = secondSource;
        current = source.num_steps;

        if (firstSource.code === 200) {
          status = 'success';
          errorMessage = source.message;
        } else {
          status = 'error';
          errorMessage = source.message;
        }
      } else {
        source = secondSource;
        current = source.steps.length;
      }

      console.log({ steps: source.steps });
      console.log({ source });

      steps = source.steps.map((step: any) => {
        const childStepTotal = step.num_steps;
        const childStepCurrent =
          childStepTotal === 0
            ? 0
            : step.steps && step.steps.length === 0
            ? 0
            : parseInt(step.steps[0].index);
        const childStepPercent =
          childStepTotal === 0
            ? childStepCurrent === 0
              ? 100
              : 0
            : getPercent(childStepTotal, childStepCurrent) > 90
            ? 100
            : getPercent(childStepTotal, childStepCurrent);

        return {
          name: step.name,
          total: childStepTotal,
          current: childStepCurrent,
          percent: childStepPercent,
        };
      });

      const total = source.num_steps;
      const stepUID = await getTrainingStepUIDByName(source.name, containerID);
      const percent = total === 0 ? 100 : getPercent(total, current);

      return {
        status: status,
        container: containerID,
        training_id: training_id,
        stepUID: stepUID,
        start_time: source.start_time,
        name: source.name,
        total: total,
        current: current,
        percent: percent,
        steps: steps,
        errorMessage,
      };
    })
  );

  console.log({ result });

  result.sort((a, b) => b.stepUID - a.stepUID);

  return result;
};

const training = async (
  paradigm: string = DNNParadigm.name,
  voice: string,
  corpora: string[]
): Promise<TrainingResponse> => {
  // @ts-ignore
  TRAINING_RUNNING = true;

  const trainingParadigmDao = new TrainingParadigmDao();

  const currentParadigm = await trainingParadigmDao.findItem({
    name: paradigm,
  });

  if (!currentParadigm) {
    return {
      success: false,
      errors: [
        {
          message: 'Can not find any paradigm, please try again.',
        },
      ],
    };
  }

  const training_id = uuid();

  console.log({ training_id });

  await trainingParadigmDao.updateItem(currentParadigm, {
    curr_training_id: training_id,
    status: 'active',
  });

  try {
    const firstStep = currentParadigm.steps.find(step => step.uid === 1);

    await axios.post(firstStep!.step.url, {
      voice: voice || 'hn_female_test',
      corpora: corpora || ['book', 'news'],
      training_id: training_id,
      train_ratio: 0.9,
    });
    return { success: true, curTrainingId: training_id };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      errors: [{ message: 'Some thing went wrong while process training' }],
    };
  }
};

function pingELK() {
  setInterval(async () => {
    console.log('ping elk');

    // @ts-ignore
    if (TRAINING_RUNNING) {
      const progresses = await getCurrProgress();
      console.log(util.inspect(progresses, { showHidden: false, depth: null }));

      if (progresses && progresses.filter(p => p !== null).length > 0) {
        console.log('Progresses Before Sort: ', progresses);

        progresses.sort((a, b) => {
          // @ts-ignore
          return new Date(b?.start_time) - new Date(a?.start_time);
        });
        console.log('Progresses After Sort: ', progresses);

        const latest = progresses[0];

        if (latest!.status === 'success') {
          await new TrainingStepFinishedPublisher(natsWrapper.client).publish({
            prevUID: latest!.stepUID,
            training_id: latest!.training_id,
            url: '',
            status: 'success',
          });
        } else if (latest!.status === 'error') {
          await new TrainingStepFinishedPublisher(natsWrapper.client).publish({
            prevUID: latest!.stepUID,
            training_id: latest!.training_id,
            url: '',
            status: 'error',
          });
        }

        console.log(progresses);
      } else {
        console.log('Progress is not valid');
      }
    }
  }, 10 * 1000);
}

const isTraining = async (): Promise<IsTrainingResponse> => {
  const trainingParadigmDao = new TrainingParadigmDao();

  const activeTrainingParadigm = await trainingParadigmDao.findItem({
    status: 'active',
  });

  if (!activeTrainingParadigm) {
    return {
      success: true,
      data: { isTraining: false, currTrainingId: null },
    };
  }

  return {
    success: true,
    data: {
      isTraining: true,
      currTrainingId: activeTrainingParadigm.curr_training_id,
    },
  };
};

const getTrainingParadigms = async (
  query: PaginateQuery
): Promise<GetTrainingParadigmsResponse> => {
  const trainingParadigmDao = new TrainingParadigmDao();

  const paginated = await trainingParadigmDao.findAll({ paginateQuery: query });

  return {
    success: true,
    paginatedTrainingParadigms: paginated,
  };
};

const trainingService = {
  training,
  getTrainingProgress,
  pingELK,
  isTraining,
  getTrainingParadigms,
};

export { trainingService };
