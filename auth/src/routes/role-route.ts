import express from 'express';
import {
  validateRequest,
  authUser,
  requireAuth,
  requireRootUser,
} from '@tts-dev/common';

import {
  createRoleValidator,
  updateRoleValidator,
  roleIdValidator,
  roleIdsValidator,
} from '../validators/role-validator';
import { roleMiddleware } from '../middlewares/role-middleware';
import { roleController } from '../controllers/role-controller';

const router = express.Router();

router.get(
  '/',
  authUser,
  requireAuth,
  roleMiddleware.canRead,
  roleController.getRoles
);
router.get(
  '/:id',
  authUser,
  requireAuth,
  roleMiddleware.canRead,
  roleController.getRole
);
router.post(
  '/',
  authUser,
  requireAuth,
  roleMiddleware.canCreate,
  createRoleValidator,
  validateRequest,
  roleController.createRole
);
router.put(
  '/update/:id',
  authUser,
  requireAuth,
  roleMiddleware.canUpdate,
  roleIdValidator,
  validateRequest,
  updateRoleValidator,
  validateRequest,
  roleController.updateRole
);
router.delete(
  '/delete',
  authUser,
  requireRootUser,
  roleIdsValidator,
  validateRequest,
  roleController.deleteRoles
);
router.put(
  '/approve',
  authUser,
  requireRootUser,
  roleIdsValidator,
  validateRequest,
  roleController.approveRoles
);

export { router as roleRoute };
