import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import fileUpload from 'express-fileupload';
import { errorHandler, NotFoundError } from '@tts-dev/common';
import cors from 'cors';

import { trainingRoute } from './routes/training';

const app = express();

app.use(cors());
app.use(fileUpload());
app.set('trust proxy', true);
app.use(json());

app.use('/api/training', trainingRoute);

app.all('*', async () => {
  throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };
