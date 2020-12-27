import { UnAuthorizeError } from '@tts-dev/common';
import { Request, Response, NextFunction } from 'express';
import { BroadcasterDao } from '../daos/broadcaster-dao';
import { BroadcasterDoc } from '../models/broadcaster';

const requireBroadcaster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.authUser!;
  const broadcasterDao = new BroadcasterDao();

  const { docs } = await broadcasterDao.findAll({
    paginateQuery: {},
    needAll: true,
  });
  const broadcaster = (docs as BroadcasterDoc[]).find(doc => {
    return doc.user.id === id;
  });

  if (!broadcaster) {
    throw new UnAuthorizeError();
  }

  next();
};

const broadcasterMiddleware = { requireBroadcaster };

export { broadcasterMiddleware };
