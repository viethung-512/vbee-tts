import { connectDB } from './utils/db';
import { app } from './app';

const start = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
};

start();
