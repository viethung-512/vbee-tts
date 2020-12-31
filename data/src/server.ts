import { connectDB } from './utils/db';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { getEnv } from './configs/env-config';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { UserDeletedListener } from './events/listeners/user-deleted-listener';
import { UserUpdatedListener } from './events/listeners/user-updated-listener';
import { ScreenshotCreatedListener } from './events/listeners/screenshot-created-listener';

const start = async () => {
  const { nats, port } = getEnv();

  try {
    await natsWrapper.connect(nats.clusterId, nats.clientId, nats.url);
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new UserCreatedListener(natsWrapper.client).listen();
    new UserDeletedListener(natsWrapper.client).listen();
    new UserUpdatedListener(natsWrapper.client).listen();
    new ScreenshotCreatedListener(natsWrapper.client).listen();

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
