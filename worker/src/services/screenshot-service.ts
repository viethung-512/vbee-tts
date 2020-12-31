import fs from 'fs';
import { v4 as uuid } from 'uuid';
import textToImage from 'text-to-image';
import Jimp from 'jimp';
import { getEnv } from '../configs/env-config';

const { staticURL } = getEnv();
const logo = `${staticURL}/images/logo/01.png`;

const addWatermark = async (
  originImageURL: string,
  watermarkURL: string = logo
) => {
  const LOGO_MARGIN_PERCENTAGE = 3;

  console.log({ originImageURL });

  const watermark = await Jimp.read(watermarkURL);
  let image = await Jimp.read(originImageURL);

  watermark.resize(image.bitmap.width / 10, Jimp.AUTO);
  watermark.opacity(0.5);

  const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
  const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

  const X = image.bitmap.width - watermark.bitmap.width - xMargin;
  const Y = image.bitmap.height - watermark.bitmap.height - yMargin;

  image = await image.composite(watermark, X, Y, {
    mode: Jimp.BLEND_SCREEN,
    opacitySource: 0.1,
    opacityDest: 1,
  });

  await image.write(originImageURL);

  return originImageURL;
};

const getImageForString = async ({
  uploadPath,
  content,
}: {
  uploadPath: string;
  content: string;
}): Promise<string> => {
  const imageForContent = await textToImage.generate(content, {
    fontSize: 20,
    margin: 0,
    maxWidth: 640,
  });
  const base64Image = imageForContent.split(';base64,').pop();

  const fileName = `${uuid()}.png`;

  return new Promise((resolve, reject) => {
    fs.writeFile(
      `${uploadPath}/${fileName}`,
      base64Image!,
      { encoding: 'base64' },
      err => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(`${uploadPath}/${fileName}`);
      }
    );
  });
};

const screenshotService = { getImageForString, addWatermark };

export { screenshotService };
