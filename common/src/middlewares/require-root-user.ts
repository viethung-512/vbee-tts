import { Request, Response, NextFunction } from 'express';

import { AuthenticationError } from '../errors/authentication-error';
import { UnAuthorizeError } from '../errors/not-authorize-error';
import { rootRole } from '../constants/root-role';

export const requireRootUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.authUser) {
    throw new AuthenticationError();
  }

  const authUser = req.authUser;

  if (authUser.role.name !== rootRole.name) {
    throw new UnAuthorizeError();
  }

  next();
};
