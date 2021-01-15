import Queue from 'bull';
import axios, { Method } from 'axios';
import { getEnv } from '../configs/env-config';
import client from '../utils/elasticsearch';
import { trainingSteps } from '../configs/training-config';
import { TrainingProgressDao } from '../daos/training-progress-dao';

interface Payload {
  training_id: string;
  uid: number;
  name: string;
  url: string;
  method: Method;
}

const { redis } = getEnv();

const updateStepStatus = async (
  training_id: string,
  stepName: string,
  status: 'waiting' | 'processing' | 'success' | 'error'
) => {
  const trainingProgressDao = new TrainingProgressDao();
  const trainingProgress = await trainingProgressDao.findItem({ training_id });

  const newSteps: {
    name: string;
    status?: 'waiting' | 'processing' | 'success' | 'error';
    errorMessage?: string;
  }[] = trainingProgress!.steps.map(step => {
    if (step.name === stepName) {
      return {
        name: stepName,
        status: status,
      };
    }

    return step;
  });

  await trainingProgressDao.updateItem(trainingProgress!, { steps: newSteps });
};

const trainingQueue = new Queue<Payload>('training:step', {
  redis: { host: redis.host, port: redis.port, password: redis.password },
});

trainingQueue.process(async (job, done) => {
  console.log('training queue received data', job.data);
  const { training_id, name, url, method } = job.data;
  let success = false;
  let count = 0;

  try {
    // await updateStepStatus(training_id, name, 'processing');
    console.log(`Status of step ${name} has been updated to processing`);

    // const res = await axios({
    //   url,
    //   method,
    // });

    // await updateStepStatus(training_id, name, 'success');
    console.log(`Status of step ${name} has been updated to success`);

    console.log(`Done step ${name} with response: `);
    // console.log(JSON.stringify(res.data));
    // done();
  } catch (err) {
    throw new Error(err);
  }
});

export { trainingQueue };
