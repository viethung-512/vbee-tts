import mongoose from 'mongoose';

import { getEnv } from '../configs/env-config';
import { VoiceDao } from '../daos/voice-dao';
import { defaultVoices } from '../constants/voice-constant';

const initDB = async () => {
  const voiceDao = new VoiceDao();

  await Promise.all(
    defaultVoices.map(async v => {
      const voice = await voiceDao.findItem({ name: v.name, code: v.code });

      if (!voice) {
        await voiceDao.createItem({
          name: v.name,
          code: v.code,
        });
      }
    })
  );
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

    await initDB();
    console.log('database initialized');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
