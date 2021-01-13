import axios from 'axios';
import { ServiceResponse } from '@tts-dev/common';
import { v4 as uuid } from 'uuid';

import { TrainingParadigmDao } from '../daos/training-paradigm-dao';
import client from '../utils/elasticsearch';
import { getEnv } from '../configs/env-config';

interface TrainingStepResponse {
  name: string;
  total: number;
  current: number;
  percent: number;
}

interface TrainingResponse extends ServiceResponse {}

interface TrainingProgressResponse extends ServiceResponse {
  progresses?: {
    name: string;
    status: boolean;
    steps: {
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
    }[];
  }[];
}

const getTrainingProgress = async (): Promise<TrainingProgressResponse> => {
  const { elasticsearch } = getEnv();

  const res = await client.search({
    index: 'tts_training_log-f9fa47a0-eb93-41aa-89b4-c6da3a9beea9',
    type: '_doc',
    body: {
      size: 5,
      query: {
        match: {
          'json.training_id': {
            query: 'hn_female_test_book_news_12345',
          },
        },
      },
      _source: ['json'],
    },
  });

  for (const tweet of res.hits.hits) {
    console.log('tweet:', tweet);
  }

  return {
    success: true,
  };
};

const training = async (): Promise<TrainingResponse> => {
  const trainingParadigmDao = new TrainingParadigmDao();

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

  try {
    await Promise.all(
      currentParadigm.steps.map(async step => {
        const res = await axios({
          url: step.url,
          method: step.method,
        });

        console.log('Training response: ', res);
      })
    );

    return {
      success: true,
    };
  } catch (err) {
    console.log('Error while training progress');
    return {
      success: false,
      errors: [{ message: 'Error while training progress' }],
    };
  }
};

const trainingService = { training, getTrainingProgress };

export { trainingService };
