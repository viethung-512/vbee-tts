require('dotenv').config();
import { connectDB } from './utils/db';
import { initIndex } from './utils/elasticsearch';
import { app } from './app';
import { getEnv } from './configs/env-config';
import { trainingService } from './services/training-service';
import { natsWrapper } from './nats-wrapper';
import { TrainingStepFinishedListener } from './events/listeners/training-step-finished-listener';

const start = async () => {
  const { nats, port } = getEnv();
  console.log('Starting......');

  try {
    await natsWrapper.connect(nats.clusterId, nats.clientId, nats.url);
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TrainingStepFinishedListener(natsWrapper.client).listen();

    await connectDB();
    await initIndex();
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
};

// @ts-ignore
global.TRAINING_RUNNING = false;

trainingService.pingELK();

start();
