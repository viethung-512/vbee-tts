import express from 'express';
import { authUser, requireRootUser } from '@tts-dev/common';
import { trainingController } from '../controllers/training-controller';

const router = express.Router();

router.get(
  '/progress/:id',
  // authUser,
  // requireRootUser,
  trainingController.getTrainingProgresses
);
router.get(
  '/paradigms',
  authUser,
  requireRootUser,
  trainingController.getParadigms
);
router.get(
  '/isTraining',
  authUser,
  requireRootUser,
  trainingController.isTraining
);
router.post(
  '/:id',
  // authUser, requireRootUser,
  trainingController.training
);

export { router as trainingRoute };
