// require('dotenv').config();

import express from 'express';
import { json } from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';

import { uploadController } from './controllers/upload-controller';
import { getEnv } from './configs/env-config';

const app = express();
const { port } = getEnv();

app.use(cors());
app.use(fileUpload({ createParentPath: true, uriDecodeFileNames: true }));
app.set('trust proxy', true);
app.use(json());

app.use('/static/resource', express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to TTS static service');
});
app.get('/favicon.ico', (req, res) => {
  res.status(204);
});
app.post('/api/static/upload', uploadController.uploadStaticFile);
app.post('/api/static/upload-audio', uploadController.uploadAudio);

app.all('*', async () => {
  console.log('route not found');
  throw new Error('Route not found');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
