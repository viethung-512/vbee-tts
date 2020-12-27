import { v4 as uuid } from 'uuid';
import {
  DialectType,
  HistoryEntity,
  HistoryEvent,
  SentenceStatus,
  SentenceType,
  ServiceResponse,
} from '@tts-dev/common';
import { UploadedFile } from 'express-fileupload';
// @ts-ignore
import readXlsxFile from 'read-excel-file/node';
import fs from 'fs';
import { importValidator } from '../validators/sentence-validator';
import { SentenceDao } from '../daos/sentence-dao';
import { HistoryDao } from '../daos/history-dao';
import { UserDao } from '../daos/user-dao';
import { SentenceDoc } from '../models/sentence';
import { oAuthService } from './gg-driver/oAuth-service';

interface ImportSentencesResponse extends ServiceResponse {
  sentences?: SentenceDoc[];
}

interface ImportRecordResponse extends ServiceResponse {
  records?: string[];
}

const moveFile = (file: UploadedFile): Promise<any> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.')[file.name.split('.').length - 1];
    const randomFilename = `${uuid()}.${fileExtension}`;

    file.mv(`./public/${randomFilename}`, err => {
      if (err) {
        reject(err);
      }

      resolve(`./public/${randomFilename}`);
    });
  });
};

const getColumns = (previewData: any[]) => {
  const firstRow = previewData[0];

  const columns = (firstRow as any[]).map((item, index) => ({
    title: item,
    field: item.toLowerCase(),
    index: index,
    width: item.toLowerCase() === 'type' ? 100 : 'auto',
  }));

  return columns;
};

const getData = (previewData: any[]) => {
  const columns = getColumns(previewData);

  const data = previewData
    .filter((it, index) => index !== 0)
    .map(row => {
      const result: Record<string, any> = {};
      (row as any[]).forEach((elm, index) => {
        const field = columns.find(cl => cl.index === index)!.field;
        result[field] = elm;
      });

      return result;
    });

  return data;
};

const importSentences = async (
  file: UploadedFile,
  userId: string
): Promise<ImportSentencesResponse> => {
  const sentenceDao = new SentenceDao();
  const historyDao = new HistoryDao();
  const userDao = new UserDao();

  const fileUploadedPath = await moveFile(file);
  const rawContent = await readXlsxFile(fileUploadedPath);

  const importContent = getData(rawContent);

  const { isValid, errors } = importValidator(importContent);
  if (!isValid) {
    return {
      success: false,
      errors,
    };
  }

  const user = await userDao.findItem(userId);

  const importedSentences = await Promise.all(
    (importContent as {
      content: string;
      type: SentenceType;
      uid?: number;
    }[]).map(async data => {
      const sentence = await sentenceDao.createItem({
        manual_uid: data.uid,
        raw: data.content,
        original: data.content,
        type: data.type,
        status: SentenceStatus.INITIAL,
        dialects: Object.values(DialectType).map(d => ({
          name: d,
          pronunciation: data.content,
        })),
      });

      await historyDao.createItem({
        entity: HistoryEntity.SENTENCE,
        event: HistoryEvent.IMPORT,
        user: user!,
        sentence: sentence,
      });

      return sentence;
    })
  );
  // const importedSentences: SentenceDoc[] = [];

  fs.unlinkSync(fileUploadedPath);

  return { success: true, sentences: importedSentences };
};

const importAudio = async (
  shareLink: string
): Promise<ImportRecordResponse> => {
  console.log('import audio controller');
  const { success, errors, files } = await oAuthService.downloadFile(shareLink);

  console.log('response received');

  if (!success) {
    return { success: false, errors };
  }

  return { success: true, records: files };
};

const importService = { importSentences, importAudio };

export { importService };
