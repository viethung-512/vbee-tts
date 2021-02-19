import Queue from 'bull';
import { DialectType, ScreenshotCreatedEvent } from '@tts-dev/common';
import { natsWrapper } from '../nats-wrapper';
import { getEnv } from '../configs/env-config';
import { ScreenshotCreatedPublisher } from '../events/publishers/screenshot-created-publisher';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import Jimp from 'jimp';
import { v4 as uuid } from 'uuid';
import textToImage from 'text-to-image';

interface Payload {
  userId: string;
  sentenceId: string;
  pronunciation: string;
  dialectId: DialectType;
  sentenceOriginal?: string;
}

const { redis, staticURL, staticHost } = getEnv();
const LOGO = `${staticURL}/images/logo/01.png`;

console.log(redis);

const getImageForString = (str: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const imageForContent = await textToImage.generate(str, {
      margin: 16,
      maxWidth: 640,
      customHeight: 120,
    });
    const base64Image = imageForContent.split(';base64,').pop();
    const fileName = `${uuid()}.png`;

    const filePath = path.resolve(__dirname, fileName);

    fs.writeFile(`${filePath}`, base64Image!, { encoding: 'base64' }, err => {
      if (err) {
        console.log('err while get image for string');
        reject(err);
      }
      resolve(`./${fileName}`);
    });
  });
};

const addWatermark = (
  imgURL: string,
  logoURL: string = LOGO
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const FILENAME = imgURL.split('/')[imgURL.split('/').length - 1];
      const ORIGINAL_IMAGE = path.resolve(__dirname, FILENAME);
      const LOGO_MARGIN_PERCENTAGE = 5;

      const [image, logo] = await Promise.all([
        Jimp.read(ORIGINAL_IMAGE),
        Jimp.read(logoURL),
      ]);

      logo.resize(image.bitmap.width / 10, Jimp.AUTO);

      const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
      const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

      const X = image.bitmap.width - logo.bitmap.width - xMargin;
      const Y = image.bitmap.height - logo.bitmap.height - yMargin;

      image.composite(
        logo,
        X,
        Y,
        // @ts-ignore
        [
          {
            mode: Jimp.BLEND_SCREEN,
            opacitySource: 0.1,
            opacityDest: 1,
          },
        ]
      );

      return image.write(path.resolve(__dirname, `./${FILENAME}`), err => {
        if (err) {
          console.log('err while add water mark');
          reject(err);
        } else {
          console.log('done');
          resolve(FILENAME);
        }
      });
    } catch (err) {
      console.log('err');
      reject(err);
    }
  });
};

const screenshotQueue = new Queue<Payload>('worker:screenshot', {
  redis: { host: redis.host, port: redis.port, password: redis.password },
});

screenshotQueue.process(async (job, done) => {
  console.log('screenshot queue received data', job.data);
  const {
    userId,
    sentenceId,
    pronunciation,
    dialectId,
    sentenceOriginal,
  } = job.data;

  try {
    const dialectImage = await getImageForString(pronunciation);
    const originalImage = await getImageForString(sentenceOriginal!);

    const dialectImageWithWatermark = await addWatermark(dialectImage);
    const originalImageWithWatermark = await addWatermark(originalImage);

    const dialectImageWithWatermarkPath = path.resolve(
      __dirname,
      dialectImageWithWatermark
    );
    const originalImageWithWatermarkPath = path.resolve(
      __dirname,
      originalImageWithWatermark
    );

    const form = new FormData();
    form.append('file', fs.createReadStream(dialectImageWithWatermarkPath));
    form.append('file', fs.createReadStream(originalImageWithWatermarkPath));
    form.append('filepath', `images/sentences/${sentenceId}/${dialectId}`);
    form.append('keepFileName', 'true');

    const res = await axios.post(`${staticHost}/api/static/upload`, form, {
      headers: { ...form.getHeaders() },
    });

    fs.unlinkSync(dialectImageWithWatermarkPath);
    fs.unlinkSync(originalImageWithWatermarkPath);

    const publishData: ScreenshotCreatedEvent['data'] = {
      userId: userId,
      sentenceId: sentenceId,
      dialectId: dialectId,
      dialectScreenshotURL: (res.data as string[]).find(img =>
        img.includes(dialectImageWithWatermark)
      )!,
      originalScreenshotURL: (res.data as string[]).find(img =>
        img.includes(originalImageWithWatermark)
      )!,
    };

    await new ScreenshotCreatedPublisher(natsWrapper.client).publish(
      publishData
    );
    done();
  } catch (err) {
    console.log('err while upload sentence image from worker service');
    console.log(err);
    throw new Error(err);
  }
});

export { screenshotQueue };
