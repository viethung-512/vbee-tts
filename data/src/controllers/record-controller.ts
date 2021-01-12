import { Request, Response } from 'express';
import {
  BadRequestError,
  FilterFieldQuery,
  NotFoundError,
  rootRole,
} from '@tts-dev/common';

import { getEnv } from '../configs/env-config';
import { recordService } from '../services/record-service';
import { importService } from '../services/import-service';

const getRecords = async (req: Request, res: Response) => {
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

  const { success, errors, paginatedRecords } = await recordService.getRecords(
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

  res.status(200).send(paginatedRecords);
};

const getRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, record } = await recordService.getRecord(id);
  if (!success) {
    throw new NotFoundError('Record not found');
  }

  res.status(200).send(record);
};

const getFirstRecord = async (req: Request, res: Response) => {
  const authUser = req.authUser!;
  const isRootUser = authUser.role.name === rootRole.name;

  const first = await recordService.getFirstRecord(authUser, isRootUser);

  res.status(200).send({ data: first });
};

const getLastRecord = async (req: Request, res: Response) => {
  const authUser = req.authUser!;
  const isRootUser = authUser.role.name === rootRole.name;

  const last = await recordService.getLastRecord(authUser, isRootUser);

  res.status(200).send({ data: last });
};

const getNextRecord = async (req: Request, res: Response) => {
  const authUser = req.authUser!;
  const isRootUser = authUser.role.name === rootRole.name;
  const { id } = req.params;

  const next = await recordService.getNextRecord(authUser, isRootUser, id);

  res.status(200).send({ data: next });
};

const getPreviousRecord = async (req: Request, res: Response) => {
  const authUser = req.authUser!;
  const isRootUser = authUser.role.name === rootRole.name;
  const { id } = req.params;

  const previous = await recordService.getPreviousRecord(
    authUser,
    isRootUser,
    id
  );

  res.status(200).send({ data: previous });
};

const importAudio = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const { shareLink } = req.body;

  const { success, errors, records } = await importService.importAudio(
    shareLink,
    userId
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(201).send(records);
};

const submitRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.authUser!.id;

  const { original } = req.body;
  const { success, errors, record } = await recordService.submitRecord(
    userId,
    id,
    { original }
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(record);
};

const submitErrorRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.authUser!.id;

  const { errorMessage } = req.body;
  const { success, errors, record } = await recordService.submitErrorRecord(
    userId,
    id,
    errorMessage
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(record);
};

const assignRecords = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const { checker, ids, count, type } = req.body;

  const { success, errors, records } = await recordService.assignRecords(
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

  res.status(200).send(records);
};

const approveRecords = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const { ids } = req.body;

  const { success, errors, records } = await recordService.approveRecords(
    userId,
    ids
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(records);
};

const deleteRecords = async (req: Request, res: Response) => {
  const userId = req.authUser!.id;
  const { ids } = req.body;

  const { success, errors, records } = await recordService.deleteRecords(
    userId,
    ids
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(records);
};

const recordController = {
  getRecords,
  getRecord,
  getFirstRecord,
  getLastRecord,
  getNextRecord,
  getPreviousRecord,
  importAudio,
  submitRecord,
  submitErrorRecord,
  assignRecords,
  approveRecords,
  deleteRecords,
};

export { recordController };
