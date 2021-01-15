import axios from 'axios';
import { ServiceResponse } from '@tts-dev/common';
import { v4 as uuid } from 'uuid';
import util from 'util';

import { TrainingParadigmDao } from '../daos/training-paradigm-dao';
import { TrainingProgressDao } from '../daos/training-progress-dao';
import client from '../utils/elasticsearch';
import { getEnv } from '../configs/env-config';
import { TrainingStepParadigm } from '../models/training-paradigm';
import { TrainingStepProgress } from '../models/training-progress';

interface TrainingResponse extends ServiceResponse {}

interface TrainingProgressResponse extends ServiceResponse {
  progresses?: ({
    training_id: string;
    container: string;
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

const getPercent = (total: number, current: number): number =>
  Math.ceil((current * 100) / total);

const getTrainingProgress = async (): Promise<TrainingProgressResponse> => {
  console.log('get training progress');

  client.ping(
    {
      // ping usually has a 3000ms timeout
      requestTimeout: 1000,
    },
    function (error) {
      if (error) {
        console.trace('elasticsearch cluster is down!');
        return {
          success: false,
          errors: [{ message: 'elasticsearch cluster is down!' }],
        };
      } else {
        console.log('All is well');
      }
    }
  );

  try {
    const { elasticsearch } = getEnv();
    const training_id = await getCurrTrainingId();

    if (!training_id) {
      console.log(training_id);
      return {
        success: true,
        progresses: [],
      };
    }

    console.log(training_id);

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
            size: 1,
            sort: [{ '@timestamp': { order: 'desc' } }],
            query: {
              bool: {
                must: [
                  {
                    match: { 'json.training_id': training_id },
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
        const source = (res.hits.hits[0]._source as any).json;

        console.log({ containerID });

        const total = source.num_steps;
        const current = source.steps.length;

        return {
          container: containerID,
          training_id: training_id,
          start_time: source.start_time,
          name: source.name,
          total: total,
          current: current > total / 2 ? total : current,
          percent:
            total === 0
              ? 0
              : Math.ceil((current * 100) / total) > 50
              ? 100
              : Math.ceil((current * 100) / total),
          steps: source.steps.map((step: any) => {
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
                : Math.ceil((childStepCurrent * 100) / childStepTotal);

            return {
              name: step.name,
              total: childStepTotal,
              current: childStepCurrent,
              percent: childStepPercent,
            };
          }),
        };
      })
    );

    console.log(util.inspect(result, { showHidden: false, depth: null }));

    return {
      success: true,
      progresses: result,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      errors: [{ message: 'Something went wrong while get training id' }],
    };
  }
};

const getCurrTrainingId = async (): Promise<string | null> => {
  const trainingParadigmDao = new TrainingParadigmDao();
  const trainingProgressDao = new TrainingProgressDao();

  const activeTrainingParadigm = await trainingParadigmDao.findItem({
    status: 'active',
  });

  if (!activeTrainingParadigm) {
    return null;
  }

  // const currTrainingProgress = await trainingProgressDao.findItem({
  //   paradigm: activeTrainingParadigm,
  // });
  const { docs, totalDocs } = await trainingProgressDao.findAll({
    paginateQuery: {},
    needAll: true,
    sort: { createdAt: 1 },
  });

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
  console.log('ping elk');

  client.ping(
    {
      requestTimeout: 1000,
    },
    function (error) {
      if (error) {
        console.trace('elasticsearch cluster is down!');
      } else {
        console.log('All is well');

        setInterval(async () => {
          // @ts-ignore
          if (TRAINING_RUNNING) {
            const { success, errors, progresses } = await getTrainingProgress();
            if (!success) {
              throw new Error('Error while ping elk');
            }

            if (
              progresses &&
              progresses.length > 0 &&
              progresses.filter(p => p).length > 0
            ) {
              progresses!.sort(function (a, b) {
                // @ts-ignore
                return new Date(b.start_time) - new Date(a.start_time);
              });
              const latest = progresses![0]!;
              const options = {
                voice: 'hn_female_test',
                corpora: ['book', 'news'],
                training_id: latest.training_id,
              };
              if (
                latest.container === 'kaldi' &&
                latest.name.endsWith('prepare_text')
              ) {
                // await updateStepStatus(
                //   latest.training_id,
                //   'Kaldi Prepare Text',
                //   'success'
                // );
                await axios.post(
                  'http://43.239.223.87:5002/audio-labeling/prepare-audio',
                  options
                );
              } else if (
                latest.container === 'kaldi' &&
                latest.name.endsWith('prepare_audio')
              ) {
                // await updateStepStatus(
                //   latest.training_id,
                //   'Kaldi Prepare Audio',
                //   'success'
                // );
                await axios.post(
                  'http://43.239.223.87:5002/audio-labeling/align-phoneme-audio',
                  options
                );
              } else if (
                latest.container === 'kaldi' &&
                latest.name.endsWith('align_phoneme_audio')
              ) {
                // await updateStepStatus(
                //   latest.training_id,
                //   'Kaldi Align Phoneme Audio',
                //   'success'
                // );
                await axios.post(
                  'http://43.239.223.87:5002/audio-labeling/generate-output',
                  options
                );
              } else if (
                latest.container === 'kaldi' &&
                latest.name.endsWith('generate_output')
              ) {
                // await updateStepStatus(
                //   latest.training_id,
                //   'Kaldi Generate Output',
                //   'success'
                // );
                await axios.post(
                  'http://43.239.223.87:5002/voice-training/prepare-text',
                  options
                );
              } else if (
                latest.container === 'merlin' &&
                latest.name.endsWith('prepare_text')
              ) {
                // await updateStepStatus(
                //   latest.training_id,
                //   'Merlin Prepare Text',
                //   'success'
                // );
                await axios.post(
                  'http://43.239.223.87:5002/voice-training/prepare-audio',
                  options
                );
              } else if (
                latest.container === 'merlin' &&
                latest.name.endsWith('prepare_audio')
              ) {
                // await updateStepStatus(
                //   latest.training_id,
                //   'Merlin Prepare Audio',
                //   'success'
                // );
                await axios.post(
                  'http://43.239.223.87:5002/voice-training/config-params',
                  options
                );
              } else if (
                latest.container === 'merlin' &&
                latest.name.endsWith('config_params')
              ) {
                // await updateStepStatus(
                //   latest.training_id,
                //   'Merlin Config Params',
                //   'success'
                // );
                await axios.post(
                  'http://43.239.223.87:5002/voice-training/extract-features',
                  options
                );
              } else if (
                latest.container === 'merlin' &&
                latest.name.endsWith('extract_features')
              ) {
                // await updateStepStatus(
                //   latest.training_id,
                //   'Merlin Extract Features',
                //   'success'
                // );
                await axios.post(
                  'http://43.239.223.87:5002/voice-training/train-duration',
                  options
                );
              } else if (
                latest.container === 'merlin' &&
                latest.name.endsWith('train_duration')
              ) {
                // await updateStepStatus(
                //   latest.training_id,
                //   'Merlin Training Duration',
                //   'success'
                // );
                await axios.post(
                  'http://43.239.223.87:5002/voice-training/train-acoustic',
                  options
                );
              } else if (
                latest.container === 'merlin' &&
                latest.name.endsWith('train_acoustic')
              ) {
                // await updateStepStatus(
                //   latest.training_id,
                //   'Merlin Train Acoustic',
                //   'success'
                // );
                await axios.post(
                  'http://43.239.223.87:5002/voice-training/generate-output',
                  options
                );
              } else {
                // await updateStepStatus(
                //   latest.training_id,
                //   'Merlin Generate Output',
                //   'success'
                // );
                // @ts-ignore
                TRAINING_RUNNING = false;
              }
            }
          }
        }, 10 * 1000);
      }
    }
  );
}

const trainingService = { training, getTrainingProgress, pingELK };

export { trainingService };
