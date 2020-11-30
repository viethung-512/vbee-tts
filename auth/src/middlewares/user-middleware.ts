import { Request, Response, NextFunction } from 'express';
import {
  UnAuthorizeError,
  Action,
  Resource,
  canAccessResource,
} from '@tts-dev/common';

const canCreate = (req: Request, res: Response, next: NextFunction) => {
  const hasPermission = canAccessResource(
    req.authUser!,
    Resource.USER,
    Action.CREATE
  );

  if (!hasPermission) {
    throw new UnAuthorizeError();
  }

  next();
};

const canRead = (req: Request, res: Response, next: NextFunction) => {
  const hasPermission = canAccessResource(
    req.authUser!,
    Resource.USER,
    Action.READ
  );

  if (!hasPermission) {
    throw new UnAuthorizeError();
  }

  next();
};

const canUpdate = (req: Request, res: Response, next: NextFunction) => {
  const hasPermission = canAccessResource(
    req.authUser!,
    Resource.USER,
    Action.UPDATE
  );

  if (!hasPermission) {
    throw new UnAuthorizeError();
  }

  next();
};

const canDelete = (req: Request, res: Response, next: NextFunction) => {
  const hasPermission = canAccessResource(
    req.authUser!,
    Resource.USER,
    Action.DELETE
  );

  if (!hasPermission) {
    throw new UnAuthorizeError();
  }

  next();
};

const userMiddleware = { canCreate, canRead, canUpdate, canDelete };

export { userMiddleware };
