import express from 'express';
import {
  authUser,
  requireAuth,
  requireRootUser,
  validateRequest,
} from '@tts-dev/common';

import {
  sentenceIdValidator,
  sentenceIdsValidator,
  submitErrorValidator,
  assignValidator,
} from '../validators/sentence-validator';
import { recordMiddleware } from '../middlewares/record-middleware';
import { recordController } from '../controllers/record-controller';
import { importAudioValidator } from '../validators/record-validator';

const router = express.Router();

router.get(
  '/',
  authUser,
  requireAuth,
  recordMiddleware.canRead,
  recordController.getRecords
);
router.get(
  '/first-record',
  authUser,
  requireAuth,
  recordMiddleware.canRead,
  recordController.getFirstRecord
);
router.get(
  '/last-record',
  authUser,
  requireAuth,
  recordMiddleware.canRead,
  recordController.getLastRecord
);
router.get(
  '/:id',
  authUser,
  requireAuth,
  recordMiddleware.canRead,
  sentenceIdValidator,
  validateRequest,
  recordMiddleware.requireChecker,
  recordController.getRecord
);
router.get(
  '/:id/next-record',
  authUser,
  requireAuth,
  recordMiddleware.canRead,
  sentenceIdValidator,
  validateRequest,
  recordMiddleware.requireChecker,
  recordController.getNextRecord
);
router.get(
  '/:id/previous-record',
  authUser,
  requireAuth,
  recordMiddleware.canRead,
  sentenceIdValidator,
  validateRequest,
  recordMiddleware.requireChecker,
  recordController.getPreviousRecord
);
router.post(
  '/import',
  authUser,
  requireRootUser,
  importAudioValidator,
  validateRequest,
  recordController.importAudio
);
router.put(
  '/submit/:id',
  authUser,
  requireAuth,
  recordMiddleware.canUpdate,
  sentenceIdValidator,
  validateRequest,
  recordMiddleware.requireChecker,
  recordController.submitRecord
);
router.put(
  '/submit-error/:id',
  authUser,
  requireAuth,
  recordMiddleware.canUpdate,
  sentenceIdValidator,
  validateRequest,
  submitErrorValidator,
  validateRequest,
  recordMiddleware.requireChecker,
  recordController.submitErrorRecord
);
router.put(
  '/assign',
  authUser,
  requireRootUser,
  assignValidator,
  validateRequest,
  recordController.assignRecords
);
router.put(
  '/approve',
  authUser,
  requireRootUser,
  sentenceIdsValidator,
  validateRequest,
  recordController.approveRecords
);
router.delete(
  '/delete',
  authUser,
  requireRootUser,
  sentenceIdsValidator,
  validateRequest,
  recordController.deleteRecords
);

export { router as recordRoute };
