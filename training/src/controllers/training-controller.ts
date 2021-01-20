import { BadRequestError } from '@tts-dev/common';
import { Request, Response } from 'express';
import { trainingService } from '../services/training-service';

const getTrainingProgresses = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    success,
    errors,
    progresses,
  } = await trainingService.getTrainingProgress(id);
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  console.log(progresses);
  res.send({ progresses });
};

const training = async (req: Request, res: Response) => {
  const { voice, corpora } = req.body;
  const { id: paradigm } = req.params;

  console.log({
    paradigm,
    voice,
    corpora,
  });
  const { success, errors, curTrainingId } = await trainingService.training(
    paradigm,
    voice,
    corpora
  );

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.send(curTrainingId);
};

const isTraining = async (req: Request, res: Response) => {
  const { success, errors, data } = await trainingService.isTraining();
  console.log({
    success,
    errors,
    data,
  });

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.send(data);
};

const getParadigms = async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;
  const {
    success,
    errors,
    paginatedTrainingParadigms,
  } = await trainingService.getTrainingParadigms({
    search: search?.toString(),
    page: page ? parseInt(page.toString()) : undefined,
    limit: limit ? parseInt(limit.toString()) : undefined,
  });
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.send(paginatedTrainingParadigms);
};

const trainingController = {
  getTrainingProgresses,
  training,
  isTraining,
  getParadigms,
};

export { trainingController };
