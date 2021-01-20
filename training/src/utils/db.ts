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
          paramFields: step.paramFields,
        });
      }
    })
  );

  const dnn = await trainingParadigmDao.findItem({ name: DNNParadigm.name });
  if (!dnn) {
    const steps = await Promise.all(
      DNNParadigm.steps.map(async step => {
        const stepDoc = await trainingStepDao.findItem({ name: step.name });

        return {
          step: stepDoc!,
          uid: step.uid,
        };
      })
    );
    await trainingParadigmDao.createItem({
      name: DNNParadigm.name,
      steps: steps,
      curr_training_id: null,
      description: DNNParadigm.description,
      status: 'inactive',
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
