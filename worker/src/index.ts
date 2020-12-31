// require('dotenv').config();

import { natsWrapper } from './nats-wrapper';
import { getEnv } from './configs/env-config';
import { SentenceSubmittedListener } from './events/listeners/sentence-submitted-listener';

const start = () => {
  const { nats, port } = getEnv();
  console.log(`Listening on port ${port}...`);

  natsWrapper
    .connect(nats.clusterId, nats.clientId, nats.url)
    .then(() => {
      natsWrapper.client.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
      });
      process.on('SIGINT', () => natsWrapper.client.close());
      process.on('SIGTERM', () => natsWrapper.client.close());

      new SentenceSubmittedListener(natsWrapper.client).listen();
    })
    .catch(err => {
      console.error(err, 'err');
    });
};

start();
