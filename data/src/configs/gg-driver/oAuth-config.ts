import path from 'path';
import { google } from 'googleapis';

const credentials = require(path.resolve(
  __dirname,
  '../../../credentials.json'
));
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const googleDriverBaseURI = 'https://drive.google.com/file/d/';

const initDrive = async () => {
  const auth = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    SCOPES
  );

  const drive = google.drive({ version: 'v3', auth });

  return drive;
};

export { googleDriverBaseURI, initDrive };
