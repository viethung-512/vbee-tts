import { connectDB } from './utils/db';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { getEnv } from './configs/env-config';

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

    await connectDB();
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
};

start();
