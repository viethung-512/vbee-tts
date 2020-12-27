import express from 'express';
import {
  authUser,
  requireAuth,
  requireRootUser,
  validateRequest,
} from '@tts-dev/common';

import {
  broadcasterIdsValidator,
  broadcasterIdValidator,
  createBroadcasterValidator,
  updateBroadcasterValidator,
  submitErrorBroadcasterSentenceValidator,
  toggleFinishRecordValidator,
} from '../validators/broadcaster-validator';
import { sentenceIdValidator } from '../validators/sentence-validator';
import { broadcasterMiddleware } from '../middlewares/broadcaster-middleware';
import { broadcasterController } from '../controllers/broadcaster-controller';

const router = express.Router();

router.get(
  '/',
  authUser,
  requireRootUser,
  broadcasterController.getBroadcasters
);
router.get(
  '/isBroadcaster',
  authUser,
  requireAuth,
  broadcasterController.checkBroadcaster
);
router.get(
  '/broadcaster-sentences',
  authUser,
  requireAuth,
  broadcasterMiddleware.requireBroadcaster,
  broadcasterController.getBroadcasterSentences
);
router.get(
  '/broadcaster-sentences/:id',
  authUser,
  requireAuth,
  broadcasterMiddleware.requireBroadcaster,
  broadcasterController.getBroadcasterSentence
);
router.get(
  '/broadcaster-sentences-init',
  authUser,
  requireAuth,
  broadcasterMiddleware.requireBroadcaster,
  broadcasterController.getInitBroadcasterSentence
);
router.get(
  '/first-sentence',
  authUser,
  requireAuth,
  broadcasterMiddleware.requireBroadcaster,
  broadcasterController.getFirstSentence
);
router.get(
  '/last-sentence',
  authUser,
  requireAuth,
  broadcasterMiddleware.requireBroadcaster,
  broadcasterController.getLastSentence
);
router.get(
  '/:id/next-sentence',
  authUser,
  requireAuth,
  broadcasterMiddleware.requireBroadcaster,
  broadcasterController.getNextSentence
);
router.get(
  '/:id/previous-sentence',
  authUser,
  requireAuth,
  broadcasterMiddleware.requireBroadcaster,
  broadcasterController.getPreviousSentence
);
router.get(
  '/:id',
  authUser,
  requireRootUser,
  broadcasterIdValidator,
  validateRequest,
  broadcasterController.getBroadcaster
);

router.post(
  '/',
  authUser,
  requireRootUser,
  createBroadcasterValidator,
  validateRequest,
  broadcasterController.createBroadcaster
);
router.put(
  '/toggle-finish-record/:id',
  authUser,
  requireAuth,
  broadcasterMiddleware.requireBroadcaster,
  sentenceIdValidator,
  validateRequest,
  toggleFinishRecordValidator,
  validateRequest,
  broadcasterController.toggleFinishRecord
);
router.put(
  '/submit-error/:uid',
  authUser,
  requireAuth,
  broadcasterMiddleware.requireBroadcaster,
  submitErrorBroadcasterSentenceValidator,
  validateRequest,
  broadcasterController.submitErrorBroadcasterSentence
);
router.put(
  '/:id',
  authUser,
  requireRootUser,
  updateBroadcasterValidator,
  validateRequest,
  broadcasterController.updateBroadcaster
);
router.delete(
  '/',
  authUser,
  requireRootUser,
  broadcasterIdsValidator,
  validateRequest,
  broadcasterController.deleteBroadcasters
);

export { router as broadcasterRoute };
