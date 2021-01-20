import {
  BadRequestError,
  DialectType,
  NotFoundError,
  SentenceType,
} from '@tts-dev/common';
import { Request, Response } from 'express';
import { broadcasterService } from '../services/broadcaster-service';

const getBroadcasters = async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;

  const {
    success,
    errors,
    paginatedBroadcasters,
  } = await broadcasterService.getBroadcasters({
    search: search?.toString(),
    page: page ? parseInt(page.toString()) : undefined,
    limit: limit ? parseInt(limit.toString()) : undefined,
  });

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(paginatedBroadcasters);
};

const getBroadcaster = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, broadcaster } = await broadcasterService.getBroadcaster(id);
  if (!success) {
    throw new NotFoundError('Broadcaster not found');
  }

  res.status(200).send(broadcaster);
};

const createBroadcaster = async (req: Request, res: Response) => {
  const { user, voice, dialect, expiredAt, types } = req.body;

  const {
    success,
    errors,
    broadcaster,
  } = await broadcasterService.createBroadcaster({
    user: user,
    voice: voice,
    types: types,
    dialect: dialect,
    expiredAt: expiredAt,
    completed: [],
  });

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.send(201).send(broadcaster);
};

const updateBroadcaster = async (req: Request, res: Response) => {
  const { user, voice, dialect, expiredAt, types } = req.body;
  const { id } = req.params;

  const {
    success,
    errors,
    broadcaster,
  } = await broadcasterService.updateBroadcaster(id, {
    user: user,
    voice: voice,
    types: types,
    dialect: dialect,
    expiredAt: expiredAt,
  });

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.send(200).send(broadcaster);
};

const deleteBroadcasters = async (req: Request, res: Response) => {
  const { ids } = req.body;

  const {
    success,
    errors,
    broadcasters,
  } = await broadcasterService.deleteBroadcasters(ids);
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.send(broadcasters);
};

const checkBroadcaster = async (req: Request, res: Response) => {
  const { id } = req.authUser!;
  const { isBroadcaster } = await broadcasterService.checkBroadcaster(id);

  res.status(200).send({ data: isBroadcaster });
};

const getBroadcasterSentences = async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;

  const {
    success,
    errors,
    paginatedBroadcasterSentences,
  } = await broadcasterService.getBroadcasterSentences({
    search: search?.toString(),
    page: page ? parseInt(page.toString()) : undefined,
    limit: limit ? parseInt(limit.toString()) : undefined,
  });

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(paginatedBroadcasterSentences);
};

const getBroadcasterSentence = async (req: Request, res: Response) => {
  const { id } = req.params;
  const dialect = req.query.dialect as DialectType;

  const {
    success,
    errors,
    broadcasterSentence,
  } = await broadcasterService.getBroadcasterSentence(id, dialect);
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(broadcasterSentence);
};

const getInitBroadcasterSentence = async (req: Request, res: Response) => {
  const type = req.query.type as SentenceType;
  const dialect = req.query.dialect as DialectType;

  const {
    success,
    errors,
    broadcasterSentenceId,
  } = await broadcasterService.getInitBroadcasterSentence(type, dialect);

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send({ data: broadcasterSentenceId });
};

const getFirstSentence = async (req: Request, res: Response) => {
  const authUser = req.authUser!;

  const firstSentence = await broadcasterService.getFirstSentence(authUser);

  res.status(200).send({ data: firstSentence });
};

const getLastSentence = async (req: Request, res: Response) => {
  const authUser = req.authUser!;

  const lastSentence = await broadcasterService.getLastSentence(authUser);

  res.status(200).send({ data: lastSentence });
};

const getNextSentence = async (req: Request, res: Response) => {
  const authUser = req.authUser!;
  const { id } = req.params;

  const nextSentence = await broadcasterService.getNextSentence(authUser, id);

  res.status(200).send({ data: nextSentence });
};

const getPreviousSentence = async (req: Request, res: Response) => {
  const authUser = req.authUser!;
  const { id } = req.params;

  const previousSentence = await broadcasterService.getPreviousSentence(
    authUser,
    id
  );

  res.status(200).send({ data: previousSentence });
};

const toggleFinishRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { dialect } = req.body;
  const authUserId = req.authUser!.id;

  const {
    success,
    errors,
    broadcasterSentence,
  } = await broadcasterService.toggleFinishRecord(id, dialect, authUserId);
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(broadcasterSentence);
};

const submitErrorBroadcasterSentence = async (req: Request, res: Response) => {
  const uid = parseInt(req.params.uid);
  const { errorMessage } = req.body;
  const authUserId = req.authUser!.id;

  const {
    success,
    errors,
    sentence,
  } = await broadcasterService.submitErrorBroadcasterSentence(
    uid,
    errorMessage,
    authUserId
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(sentence);
};

const uploadAudio = async (req: Request, res: Response) => {
  console.log('upload audio');
  const userId = req.authUser!.id;
  if (!req.files)
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('Please upload your file');
    }

  const { success, errors } = await broadcasterService.uploadAudio(
    req.files.file,
    userId
  );

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }
  res.status(201).send({ success });
};

const broadcasterController = {
  getBroadcasters,
  getBroadcaster,
  createBroadcaster,
  updateBroadcaster,
  deleteBroadcasters,
  checkBroadcaster,
  getBroadcasterSentences,
  getBroadcasterSentence,
  getInitBroadcasterSentence,
  getFirstSentence,
  getLastSentence,
  getNextSentence,
  getPreviousSentence,
  toggleFinishRecord,
  submitErrorBroadcasterSentence,
  uploadAudio,
};

export { broadcasterController };
