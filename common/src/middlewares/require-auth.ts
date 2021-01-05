import { Request, Response, NextFunction } from 'express';

import { AuthenticationError } from '../errors/authentication-error';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.authUser) {
    req.session = null;
    throw new AuthenticationError();
  }

  next();
};
