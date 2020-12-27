// require('dotenv').config();

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
// import cookieSession from 'cookie-session';
import fileUpload from 'express-fileupload';
import { errorHandler, NotFoundError } from '@tts-dev/common';
import cors from 'cors';

import { authRoute } from './routes/auth-route';
import { userRoute } from './routes/user-route';
import { roleRoute } from './routes/role-route';

const app = express();

app.use(cors());
app.use(fileUpload());
app.set('trust proxy', true);
app.use(json());
// app.use(
//   cookieSession({
//     // signed: false,
//     // secure: process.env.NODE_ENV !== 'test',
//   })
// );

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/roles', roleRoute);

app.all('*', async () => {
  throw new NotFoundError('Route not found');
});

app.use(errorHandler);

export { app };
