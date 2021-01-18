import axios from 'axios';
import { ServiceResponse } from '@tts-dev/common';
import { v4 as uuid } from 'uuid';
import util from 'util';

import { TrainingParadigmDao } from '../daos/training-paradigm-dao';
import { TrainingProgressDao } from '../daos/training-progress-dao';
import client from '../utils/elasticsearch';
import { getEnv } from '../configs/env-config';
import { TrainingStepProgress } from '../models/training-progress';
import { TrainingStepFinishedPublisher } from '../events/publishers/training-step-finished-publisher';
import { natsWrapper } from '../nats-wrapper';

interface TrainingResponse extends ServiceResponse {}

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
  steps: {
    name: string;
    total: number;
    current: number;
    percent: number;
  }[];
}

interface TrainingProgressResponse extends ServiceResponse {
  progresses?: ({
    status: 'processing' | 'success' | 'error';
    training_id: string;
    container: string;
    stepUID: number;
    start_time: string;
    name: string;
    total: number;
    current: number;
    percent: number;
    steps: {
      name: string;
      total: number;
      current: number;
      percent: number;
    }[];
  } | null)[];
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

const getPercent = (total: number, current: number): number =>
  Math.ceil((current * 100) / total);

const getCurrProgress = async (): Promise<Progress[]> => {
  const { elasticsearch } = getEnv();
  const training_id = await getCurrTrainingId();

  console.log({ training_id });
  console.log('...');

  if (!training_id) {
    return [];
  }

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

  console.log(stepsName);

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
                    'json.training_id': `hn_female_test_book_news_${training_id}`,
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
        return null;
      }

      const containerID = (res.hits.hits[0]._source as any).container.id;
      const firstSource = (res.hits.hits[0]._source as any).json;
      const secondSource = (res.hits.hits[1]._source as any).json;

      let source;
      let current;
      let status = 'processing';
      let steps = [];

      if (firstSource && firstSource.code) {
        source = secondSource;
        current = source.num_steps;

        if (source.code === 200) {
          status = 'success';
        } else if (source.code === 400) {
          status = 'error';
        }
      } else {
        source = firstSource;
        current = source.steps.length;
        steps = source.steps.map((step: any) => {
          const childStepTotal = step.num_steps;
          const childStepCurrent =
            childStepTotal === 0
              ? 0
              : step.steps && step.steps.length === 0
              ? 0
              : step.steps[0].index;
          const childStepPercent =
            childStepTotal === 0
              ? childStepCurrent === 0
                ? 100
                : 0
              : getPercent(childStepTotal, childStepCurrent);

          return {
            name: step.name,
            total: childStepTotal,
            current: childStepCurrent,
            percent: childStepPercent,
          };
        });
      }

      const total = source.num_steps;
      const stepUID = await getTrainingStepUIDByName(source.name, containerID);
      const percent = total === 0 ? 100 : getPercent(total, current);

      console.log(source);

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
      };
    })
  );

  result.sort((a, b) => b.stepUID - a.stepUID);

  return result;
};

const getTrainingProgress = async (): Promise<TrainingProgressResponse> => {
  console.log('get training progress');

  try {
    const progresses = await getCurrProgress();

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
  const trainingParadigmDao = new TrainingParadigmDao();
  const trainingProgressDao = new TrainingProgressDao();

  const activeTrainingParadigm = await trainingParadigmDao.findItem({
    status: 'active',
  });

  console.log({ activeTrainingParadigm });

  if (!activeTrainingParadigm) {
    return null;
  }

  const { docs, totalDocs } = await trainingProgressDao.findAll({
    paginateQuery: {},
    needAll: true,
    sort: { createdAt: 1 },
  });

  console.log({ totalDocs, docs });

  if (totalDocs === 0) {
    return null;
  }

  return docs[0].training_id;
};

const training = async (
  voice: string,
  corpora: string[]
): Promise<TrainingResponse> => {
  // @ts-ignore
  TRAINING_RUNNING = true;

  const trainingParadigmDao = new TrainingParadigmDao();
  const trainingProgressDao = new TrainingProgressDao();

  const currentParadigm = await trainingParadigmDao.findItem({
    status: 'active',
  });

  if (!currentParadigm) {
    return {
      success: false,
      errors: [
        {
          message: 'Can not find any active paradigm, please try again.',
        },
      ],
    };
  }

  const training_id = uuid();
  console.log({ training_id });
  const steps: TrainingStepProgress[] = currentParadigm.steps.map(doc => ({
    step: doc.step,
    status: 'waiting',
  }));

  await trainingProgressDao.createItem({
    training_id,
    paradigm: currentParadigm,
    steps: steps,
  });

  try {
    const firstStep = currentParadigm.steps.find(step => step.uid === 1);

    console.log(firstStep);

    await axios.post(firstStep!.step.url, {
      voice: voice || 'hn_female_test',
      corpora: corpora || ['book', 'news'],
      training_id: training_id,
      train_ratio: 0.9,
    });
    return { success: true };
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
        }

        console.log(progresses);
      } else {
        console.log('Progress is not valid');
      }
    }
  }, 10 * 1000);
}

const trainingService = { training, getTrainingProgress, pingELK };

export { trainingService };
