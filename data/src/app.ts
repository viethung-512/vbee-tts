// require('dotenv').config();

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
// import cookieSession from 'cookie-session';
import fileUpload from 'express-fileupload';
import { errorHandler, NotFoundError } from '@tts-dev/common';
import cors from 'cors';

import { allophoneRoute } from './routes/allophone-route';
import { sentenceRoute } from './routes/sentence-route';
import { recordRoute } from './routes/record-route';
import { voiceRoute } from './routes/voice-route';
import { broadcasterRoute } from './routes/broadcaster-route';

const app = express();

app.use(cors());
app.use(fileUpload());
app.set('trust proxy', true);
app.use(json());
// app.use(
//   cookieSession({
//     signed: false,
//     // secure: process.env.NODE_ENV !== 'test',
//   })
// );

app.use('/api/sentences', sentenceRoute);
app.use('/api/records', recordRoute);
app.use('/api/voices', voiceRoute);
app.use('/api/broadcasters', broadcasterRoute);
app.use('/api/allophone', allophoneRoute);

app.all('*', async () => {
  throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };
