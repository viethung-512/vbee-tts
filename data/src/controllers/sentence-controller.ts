import { Request, Response } from 'express';
import {
  BadRequestError,
  FilterFieldQuery,
  NotFoundError,
  rootRole,
} from '@tts-dev/common';

import { getEnv } from '../configs/env-config';
import { sentenceService } from '../services/sentence-service';
import { importService } from '../services/import-service';

const getImportSampleFile = (req: Request, res: Response) => {
  const { staticHost } = getEnv();

  const importSampleFile = `${staticHost}/static/resource/files/sentences/sample-import-sentence.xlsx`;

  return res.status(200).send(importSampleFile);
};

const getSentences = async (req: Request, res: Response) => {
  const { search, page, limit, ...filtersObject } = req.query;
  const userId = req.authUser!.id;
  const isRootUser = req.authUser!.role.name === rootRole.name;

  const filters: FilterFieldQuery[] = [];

  for (const key in filtersObject) {
    if (Object.prototype.hasOwnProperty.call(filtersObject, key)) {
      const element = filtersObject[key];
      filters.push({
        field: key,
        data: element,
      });
    }
  }

  const {
    success,
    errors,
    paginatedSentences,
  } = await sentenceService.getSentences(
    userId,
    isRootUser,
    {
      search: search?.toString(),
      page: page ? parseInt(page.toString()) : undefined,
      limit: limit ? parseInt(limit.toString()) : undefined,
    },
    filters
  );

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(paginatedSentences);
};

const getSentence = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, sentence } = await sentenceService.getSentence(id);
  if (!success) {
    throw new NotFoundError('Sentence not found');
  }

  res.status(200).send(sentence);
};

const getFirstSentence = async (req: Request, res: Response) => {
  const authUser = req.authUser!;
  const isRootUser = authUser.role.name === rootRole.name;

  const firstSentence = await sentenceService.getFirstSentence(
    authUser,
    isRootUser
  );

  res.status(200).send({ data: firstSentence });
};

const getLastSentence = async (req: Request, res: Response) => {
  const authUser = req.authUser!;
  const isRootUser = authUser.role.name === rootRole.name;

  const lastSentence = await sentenceService.getLastSentence(
    authUser,
    isRootUser
  );

  res.status(200).send({ data: lastSentence });
};

const getNextSentence = async (req: Request, res: Response) => {
  const authUser = req.authUser!;
  const isRootUser = authUser.role.name === rootRole.name;
  const { id } = req.params;

  const nextSentence = await sentenceService.getNextSentence(
    authUser,
    isRootUser,
    id
  );

  res.status(200).send({ data: nextSentence });
};

const getPreviousSentence = async (req: Request, res: Response) => {
  const authUser = req.authUser!;
  const isRootUser = authUser.role.name === rootRole.name;
  const { id } = req.params;

  const previousSentence = await sentenceService.getPreviousSentence(
    authUser,
    isRootUser,
    id
  );

  res.status(200).send({ data: previousSentence });
};

const importSentences = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  // const { data } = req.body;

  if (!req.files)
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('Please upload your file');
    }

  const { success, sentences, errors } = await importService.importSentences(
    req.files.file,
    userId
  );

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  // const { success, errors, sentences } = await sentenceService.importSentences(
  //   userId,
  //   data
  // );
  // if (!success) {
  //   throw new BadRequestError('Bad Request', errors);
  // }

  res.status(201).send(sentences);
};

const submitSentence = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.authUser!.id;

  const { original, dialectHN, dialectSG } = req.body;
  const { success, errors, sentence } = await sentenceService.submitSentence(
    userId,
    id,
    {
      original,
      dialectHN,
      dialectSG,
    }
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(sentence);
};

const submitErrorSentence = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.authUser!.id;

  const { errorMessage } = req.body;
  const {
    success,
    errors,
    sentence,
  } = await sentenceService.submitErrorSentence(userId, id, errorMessage);
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(sentence);
};

const assignSentences = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const { checker, ids, count, type } = req.body;

  const { success, errors, sentences } = await sentenceService.assignSentences(
    userId,
    {
      checker,
      ids,
      count,
      type,
    }
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(sentences);
};

const approveSentences = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const { ids } = req.body;

  const { success, errors, sentences } = await sentenceService.approveSentences(
    userId,
    ids
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(sentences);
};

const deleteSentences = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const { ids } = req.body;

  const { success, errors, sentences } = await sentenceService.deleteSentences(
    userId,
    ids
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(sentences);
};

const sentenceController = {
  getImportSampleFile,
  getSentences,
  getSentence,
  getFirstSentence,
  getLastSentence,
  getNextSentence,
  getPreviousSentence,
  importSentences,
  submitSentence,
  submitErrorSentence,
  assignSentences,
  approveSentences,
  deleteSentences,
};

export { sentenceController };
