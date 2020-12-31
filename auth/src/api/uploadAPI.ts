import axios from 'axios';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import FormData from 'form-data';
import { v4 as uuid } from 'uuid';

import { getEnv } from '../configs/env-config';

const uploadFile = async (file: UploadedFile, filepath: string) => {
  const { staticHost } = getEnv();

  const fileExtension = file.name.split('.')[file.name.split('.').length - 1];
  const filename = `${uuid()}.${fileExtension}`;
  await file.mv(`./${filename}`);

  const formData = new FormData();
  formData.append('file', fs.createReadStream(`./${filename}`));
  formData.append('filepath', filepath);

  try {
    const { data } = await axios.post(
      `${staticHost}/api/static/upload`,
      formData,
      {
        headers: { ...formData.getHeaders() },
      }
    );

    fs.unlinkSync(`./${filename}`);

    return data;
  } catch (err) {
    console.log(err, 'err while uploading file from auth service');
    throw new Error(err);
  }
};

const uploadAPI = { uploadFile };

export { uploadAPI };
