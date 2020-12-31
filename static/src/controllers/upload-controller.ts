import fs from 'fs';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { getEnv } from '../configs/env-config';
import { UploadedFile } from 'express-fileupload';
import unzipper from 'unzipper';
import fileService from '../services/file-service';

const { staticURL } = getEnv();

const progressUnzipFile = (file: UploadedFile): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.')[file.name.split('.').length - 1];
    const filename = `${uuid()}.${fileExtension}`;

    const location = `./public/audio/${uuid()}`;
    const pathLocation = fileService.prepareFolder(location);

    return file
      .mv(`${pathLocation}/${filename}`)
      .then(() => {
        fs.createReadStream(`${location}/${filename}`)
          .pipe(unzipper.Extract({ path: location }))
          .on('finish', async () => {
            fs.unlinkSync(pathLocation);
            const files = await fileService.getAudiosInFolder(pathLocation);

            const filesPath = files.map(
              file => `${staticURL}/${location.split('/public/')[1]}/${file}`
            );

            resolve(filesPath);
          });

        resolve([]);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const uploadStaticFile = async (req: Request, res: Response) => {
  const { filepath, keepFileName } = req.body;

  let result: string | string[];

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  if (Array.isArray(req.files.file)) {
    result = await Promise.all(
      (req.files.file as any[]).map(async f => {
        let filename: string;

        if (keepFileName) {
          filename = f.name;
        } else {
          const fileExtension = f.name.split('.')[f.name.split('.').length - 1];
          filename = `${uuid()}.${fileExtension}`;
        }

        await f.mv(`./public/${filepath}/${filename}`, function (err: any) {
          if (err) return res.status(500).send(err);

          console.log('done move file');
        });

        return `${staticURL}/${filepath}/${filename}`;
      })
    );
  } else {
    let file = req.files.file;
    let filename: string;

    if (keepFileName) {
      filename = file.name;
    } else {
      const fileExtension = file.name.split('.')[
        file.name.split('.').length - 1
      ];
      filename = `${uuid()}.${fileExtension}`;
    }
    await file.mv(`./public/${filepath}/${filename}`, function (err) {
      if (err) return res.status(500).send(err);

      console.log('done move file');
    });

    result = `${staticURL}/${filepath}/${filename}`;
  }

  res.send(result);
};

const uploadAudio = async (req: Request, res: Response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let file = req.files.file;

  const result = await progressUnzipFile(file);

  res.send(result);
};

const uploadController = { uploadStaticFile, uploadAudio };

export { uploadController };
