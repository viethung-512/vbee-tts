import { connectDB } from './utils/db';
import { app } from './app';
import { getEnv } from './configs/env-config';

const start = async () => {
  const { port } = getEnv();
  console.log('Starting...');

  try {
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
