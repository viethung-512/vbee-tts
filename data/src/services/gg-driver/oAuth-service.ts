import fs from 'fs';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import { Readable } from 'stream';
import { GaxiosResponse } from 'gaxios';
import FormData from 'form-data';

import { getEnv } from '../../configs/env-config';
import { getPercent } from '../../utils/helper';
import {
  googleDriverBaseURI,
  initDrive,
} from '../../configs/gg-driver/oAuth-config';
import { GGDriverInitializedPublisher } from '../../events/publishers/gg-driver-initialized-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { FileDownloadedPublisher } from '../../events/publishers/file-downloaded-publisher';
import { ServiceResponse } from '@tts-dev/common';

const { hostURL } = getEnv();

interface DownloadFileResponse extends ServiceResponse {
  files?: string[];
}

const progressDownloadFile = ({
  res,
  total,
  originalFilename,
}: {
  res: GaxiosResponse<Readable>;
  total: number;
  originalFilename: string;
}): Promise<{ filePath: string }> => {
  return new Promise((resolve, reject) => {
    const fileExtension = originalFilename.split('.')[
      originalFilename.split('.').length - 1
    ];

    const filePath = `./${uuid()}.${fileExtension}`;

    console.log(`writing to ${filePath}`);
    const dest = fs.createWriteStream(filePath);
    let current = 0;

    res.data
      .on('data', async d => {
        current += d.length;
        const percent = getPercent({ total, current });

        const progress = { total, current, percent };
        // pubsub.publish(FILE_DOWNLOADING, { fileDownloading: progress });
        await new FileDownloadedPublisher(natsWrapper.client).publish({
          total: progress.total,
          current: progress.current,
          percent: progress.percent,
        });
      })
      .on('end', () => {
        console.log('Done downloading file.');
        resolve({ filePath });
      })
      .on('error', err => {
        console.error('Error downloading file.');
        reject(err);
      })
      .pipe(dest);
  });
};

const getFileId = (shareLink: string) => {
  const fileId = shareLink.split(googleDriverBaseURI)[1].split('/')[0];

  return fileId;
};

async function downloadFile(shareLink: string): Promise<DownloadFileResponse> {
  const drive = await initDrive();
  console.log('end init drive');
  console.log('start download file');

  try {
    await new GGDriverInitializedPublisher(natsWrapper.client).publish({
      initialized: true,
    });

    const fileId = getFileId(shareLink);

    const {
      data: { size, name: fileName },
    } = await drive.files.get({ fileId, fields: 'size,name' });

    const res = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    res.data;

    const { filePath } = await progressDownloadFile({
      res,
      total: parseInt(size!.toString()),
      originalFilename: fileName!.toString(),
    });

    console.log({ filePath });

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const { data } = await axios.post(
      `${hostURL}/api/static/upload-audio`,
      form,
      {
        headers: { ...form.getHeaders() },
      }
    );

    fs.unlinkSync(filePath);

    console.log('end download file');

    return {
      success: true,
      files: data,
    };
  } catch (err) {
    console.log('error: ', err);
    return {
      success: false,
      errors: [
        { message: 'Something when wrong while download gg-driver file' },
      ],
    };
  }
}

const oAuthService = { downloadFile };

export { oAuthService };
