import { BadRequestError } from '@tts-dev/common';
import { Request, Response } from 'express';
import { trainingService } from '../services/training-service';

const getTrainingProgresses = async (req: Request, res: Response) => {
  const {
    success,
    errors,
    progresses,
  } = await trainingService.getTrainingProgress();
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }
  res.send({ progresses });
};

const training = async (req: Request, res: Response) => {
  const { voice, corpora } = req.body;
  const { success, errors } = await trainingService.training(voice, corpora);

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.send('Training started...');
};

const trainingController = { getTrainingProgresses, training };

export { trainingController };
