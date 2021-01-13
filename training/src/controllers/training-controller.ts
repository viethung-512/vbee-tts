import { Request, Response } from 'express';
import { trainingService } from '../services/training-service';

const getTrainingProgresses = async (req: Request, res: Response) => {
  const { success } = await trainingService.getTrainingProgress();
  console.log('Training Progresses response');
  res.send({ success });
};

const training = async (req: Request, res: Response) => {
  res.send('Training started...');
};

const trainingController = { getTrainingProgresses, training };

export { trainingController };
