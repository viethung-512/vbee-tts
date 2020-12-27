import path from 'path';
import { google } from 'googleapis';

import { authenticate } from '@google-cloud/local-auth';

const KEY_FILE_PATH = path.join(__dirname, '../../../client_id.json');
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
];

const googleDriverBaseURI = 'https://drive.google.com/file/d/';

const initDrive = async () => {
  console.log('start init drive');
  const auth = await authenticate({
    keyfilePath: KEY_FILE_PATH,
    scopes: SCOPES,
  });
  google.options({ auth });

  const drive = google.drive('v3');

  return drive;
};

export { googleDriverBaseURI, initDrive };
