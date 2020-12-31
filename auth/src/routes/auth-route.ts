import express from 'express';
import { validateRequest, authUser, requireAuth } from '@tts-dev/common';

import {
  loginValidator,
  changePasswordValidator,
} from '../validators/auth-validator';
import { authController } from '../controllers/auth-controller';

const router = express.Router();

router.post('/login', loginValidator, validateRequest, authController.login);
router.post('/logout', authController.logout);
router.put(
  '/change-password',
  authUser,
  requireAuth,
  changePasswordValidator,
  validateRequest,
  authController.changePassword
);
router.put(
  '/upload-avatar',
  authUser,
  requireAuth,
  authController.uploadAvatar
);
router.get('/me', authUser, requireAuth, authController.getMe);

export { router as authRoute };
