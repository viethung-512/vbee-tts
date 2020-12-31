import { Request, Response, NextFunction } from 'express';
import {
  UnAuthorizeError,
  Action,
  Resource,
  canAccessResource,
  BadRequestError,
  rootRole,
} from '@tts-dev/common';
import { RecordDao } from '../daos/record-dao';
import { UserDao } from '../daos/user-dao';

const canCreate = (req: Request, res: Response, next: NextFunction) => {
  const hasPermission = canAccessResource(
    req.authUser!,
    Resource.RECORD,
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
    Resource.RECORD,
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
    Resource.RECORD,
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
    Resource.RECORD,
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
    next();
  } else {
    const userId = req.authUser!.id;
    const { id } = req.params;

    const recordDao = new RecordDao();
    const userDao = new UserDao();

    const checker = await userDao.findItem(userId);
    if (!checker) {
      throw new BadRequestError('Bad Request', [{ message: 'User not found' }]);
    }

    const record = await recordDao.findItem({
      _id: id,
      checker: checker,
    });

    if (!record) {
      throw new UnAuthorizeError();
    }

    next();
  }
};

const recordMiddleware = {
  canCreate,
  canRead,
  canUpdate,
  canDelete,
  requireChecker,
};

export { recordMiddleware };
