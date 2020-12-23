import fs from 'fs';
import mkdirp from 'mkdirp';

const prepareFolder = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    mkdirp.sync(folderPath);
  }
  return folderPath;
};

const getAudiosInFolder = (folderPath: string): Promise<string[]> => {
  return new Promise((resolve, rejects) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        rejects(err);
      }
      resolve(files);
    });
  });
};

const fileService = {
  prepareFolder,
  getAudiosInFolder,
};

export default fileService;
