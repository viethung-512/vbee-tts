import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUser } from '../types/auth-user';

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

export const authUser = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    const token = req.headers.authorization.split('Bearer ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;

      req.authUser = decoded;
    } catch (err) {
      console.log('error while verify token: ', err);
    }
  }

  next();
};
