import express from 'express';
import {
  validateRequest,
  authUser,
  requireAuth,
  requireRootUser,
} from '@tts-dev/common';

import {
  createUserValidator,
  updateUserValidator,
  userIdValidator,
  userIdsValidator,
} from '../validators/user-validator';
import { userMiddleware } from '../middlewares/user-middleware';
import { userController } from '../controllers/user-controller';

const router = express.Router();

router.get(
  '/',
  authUser,
  requireAuth,
  userMiddleware.canRead,
  userController.getUsers
);
router.get(
  '/:id',
  authUser,
  requireAuth,
  userMiddleware.canRead,
  userController.getUser
);
router.post(
  '/',
  authUser,
  requireAuth,
  userMiddleware.canCreate,
  createUserValidator,
  validateRequest,
  userController.createUser
);
router.put(
  '/update/:id',
  authUser,
  requireAuth,
  userMiddleware.canUpdate,
  userIdValidator,
  validateRequest,
  updateUserValidator,
  validateRequest,
  userController.updateUser
);
router.delete(
  '/delete',
  authUser,
  requireRootUser,
  userIdsValidator,
  validateRequest,
  userController.deleteUsers
);

export { router as userRoute };
