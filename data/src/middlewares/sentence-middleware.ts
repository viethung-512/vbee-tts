import { Request, Response, NextFunction } from 'express';
import {
  UnAuthorizeError,
  Action,
  Resource,
  canAccessResource,
  BadRequestError,
  rootRole,
} from '@tts-dev/common';
import { SentenceDao } from '../daos/sentence-dao';
import { UserDao } from '../daos/user-dao';

const canCreate = (req: Request, res: Response, next: NextFunction) => {
  const hasPermission = canAccessResource(
    req.authUser!,
    Resource.SENTENCE,
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
    Resource.SENTENCE,
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
    Resource.SENTENCE,
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
    Resource.SENTENCE,
    Action.DELETE
  );

  if (!hasPermission) {
    throw new UnAuthorizeError();
  }

  next();
};

const requireChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.authUser!.role.name === rootRole.name) {
    return next();
  }

  const userId = req.authUser!.id;
  const { id } = req.params;

  const sentenceDao = new SentenceDao();
  const userDao = new UserDao();

  const checker = await userDao.findItem(userId);
  if (!checker) {
    throw new BadRequestError('Bad Request', [{ message: 'User not found' }]);
  }

  const sentence = await sentenceDao.findItem({
    _id: id,
    checker: checker,
  });

  if (!sentence) {
    throw new UnAuthorizeError();
  }

  return next();
};

const sentenceMiddleware = {
  canCreate,
  canRead,
  canUpdate,
  canDelete,
  requireChecker,
};

export { sentenceMiddleware };
