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
import { sentenceMiddleware } from '../middlewares/sentence-middleware';
import { sentenceController } from '../controllers/sentence-controller';

const router = express.Router();

router.get(
  '/import-sample-file',
  authUser,
  requireRootUser,
  sentenceController.getImportSampleFile
);
router.get(
  '/',
  authUser,
  requireAuth,
  sentenceMiddleware.canRead,
  // validateRequest,
  sentenceController.getSentences
);
router.get(
  '/first-sentence',
  authUser,
  requireAuth,
  sentenceMiddleware.canRead,
  sentenceController.getFirstSentence
);
router.get(
  '/last-sentence',
  authUser,
  requireAuth,
  sentenceMiddleware.canRead,
  sentenceController.getLastSentence
);
router.get(
  '/:id',
  authUser,
  requireAuth,
  sentenceMiddleware.canRead,
  sentenceIdValidator,
  validateRequest,
  sentenceMiddleware.requireChecker,
  sentenceController.getSentence
);
router.get(
  '/:id/next-sentence',
  authUser,
  requireAuth,
  sentenceMiddleware.canRead,
  sentenceIdValidator,
  validateRequest,
  sentenceMiddleware.requireChecker,
  sentenceController.getNextSentence
);
router.get(
  '/:id/previous-sentence',
  authUser,
  requireAuth,
  sentenceMiddleware.canRead,
  sentenceIdValidator,
  validateRequest,
  sentenceMiddleware.requireChecker,
  sentenceController.getPreviousSentence
);
router.post(
  '/import',
  authUser,
  requireRootUser,
  sentenceController.importSentences
);
router.put(
  '/submit/:id',
  authUser,
  requireAuth,
  sentenceMiddleware.canUpdate,
  sentenceIdValidator,
  validateRequest,
  sentenceMiddleware.requireChecker,
  sentenceController.submitSentence
);
router.put(
  '/submit-error/:id',
  authUser,
  requireAuth,
  sentenceMiddleware.canUpdate,
  sentenceIdValidator,
  validateRequest,
  submitErrorValidator,
  validateRequest,
  sentenceMiddleware.requireChecker,
  sentenceController.submitErrorSentence
);
router.put(
  '/assign',
  authUser,
  requireRootUser,
  assignValidator,
  validateRequest,
  sentenceController.assignSentences
);
router.put(
  '/approve',
  authUser,
  requireRootUser,
  sentenceIdsValidator,
  validateRequest,
  sentenceController.approveSentences
);
router.delete(
  '/delete',
  authUser,
  requireRootUser,
  sentenceIdsValidator,
  validateRequest,
  sentenceController.deleteSentences
);

export { router as sentenceRoute };
