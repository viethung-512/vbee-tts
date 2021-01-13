import mongoose from 'mongoose';

import { getEnv } from '../configs/env-config';
import { trainingSteps, DNNParadigm } from '../configs/training-config';
import { TrainingStepDao } from '../daos/training-step-dao';
import { TrainingParadigmDao } from '../daos/training-paradigm-dao';

const initDB = async () => {
  const trainingStepDao = new TrainingStepDao();
  const trainingParadigmDao = new TrainingParadigmDao();

  await Promise.all(
    trainingSteps.map(async step => {
      const trainingStep = await trainingStepDao.findItem({ name: step.name });
      if (!trainingStep) {
        await trainingStepDao.createItem({
          name: step.name,
          url: step.url,
          description: step.description,
          method: step.method,
        });
      }
    })
  );

  const dnn = await trainingParadigmDao.findItem({ name: DNNParadigm.name });
  if (!dnn) {
    await trainingParadigmDao.createItem({
      name: DNNParadigm.name,
      steps: DNNParadigm.steps,
      description: DNNParadigm.description,
      status: 'active',
    });
  }
};

export const connectDB = async () => {
  const { mongo } = getEnv();

  try {
    await mongoose.connect(mongo.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('database connected');

    await initDB();

    console.log('database initialized');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
