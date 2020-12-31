import express from 'express';
import { authUser, requireRootUser, validateRequest } from '@tts-dev/common';
import { getAllophoneValidator } from '../validators/allophone-validator';
import { allophoneController } from '../controllers/allophone-controller';

const router = express.Router();

router.get(
  '/',
  authUser,
  requireRootUser,
  getAllophoneValidator,
  validateRequest,
  allophoneController.getPronunciationAndAddAllophoneContent
);

export { router as allophoneRoute };
