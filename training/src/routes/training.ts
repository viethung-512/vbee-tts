import express from 'express';
import { authUser, requireRootUser } from '@tts-dev/common';
import { trainingController } from '../controllers/training-controller';

const router = express.Router();

router.get(
  '/progress',
  // authUser,
  // requireRootUser,
  trainingController.getTrainingProgresses
);
router.post('/', authUser, requireRootUser, trainingController.training);

export { router as trainingRoute };
