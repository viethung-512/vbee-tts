import { body, param } from 'express-validator';
import {
  BadRequestError,
  DialectType,
  isIdsValid,
  isIdValid,
  NotFoundError,
  SentenceType,
} from '@tts-dev/common';
import { UserDao } from '../daos/user-dao';
import { VoiceDao } from '../daos/voice-dao';
import { BroadcasterDao } from '../daos/broadcaster-dao';

export const broadcasterIdValidator = [
  param('id').custom(value => {
    if (!isIdValid(value)) {
      throw new NotFoundError('Broadcaster Not found');
    }

    return true;
  }),
];

export const createBroadcasterValidator = [
  body('user')
    .trim()
    .notEmpty()
    .withMessage('User in broadcaster is required')
    .custom(value => {
      if (!isIdValid(value)) {
        throw new Error('User not found');
      }

      const userDao = new UserDao();

      return userDao.findItem(value).then(user => {
        if (!user) {
          return Promise.reject('User not found');
        }

        return Promise.resolve();
      });
    }),
  body('voice')
    .trim()
    .notEmpty()
    .withMessage('Voice in broadcaster is required')
    .custom(value => {
      if (!isIdValid(value)) {
        throw new Error('Voice not found');
      }

      const voiceDao = new VoiceDao();

      return voiceDao.findItem(value).then(voice => {
        if (!voice) {
          return Promise.reject('Voice not found');
        }

        return Promise.resolve();
      });
    }),
  body('dialect').custom(value => {
    if (!Object.values(DialectType).includes(value)) {
      throw new Error('Dialect is not valid');
    }

    return true;
  }),
  body('expiredAt')
    .trim()
    .notEmpty()
    .withMessage('Expired At is required')
    .custom(value => {
      const expired = new Date(value);
      const currentDate = new Date();

      if (expired.getTime() < currentDate.getTime()) {
        throw new Error('ExpiredAt must more than current date');
      }

      return true;
    }),
  body('types').custom(value => {
    const typesValid = Object.values(SentenceType).every(t =>
      (value as SentenceType[]).includes(t)
    );

    if (typesValid) {
      throw new Error('Sentence Types is not valid');
    }

    return true;
  }),
];

export const updateBroadcasterValidator = [
  param('id').custom(value => {
    if (!isIdValid(value)) {
      throw new Error('Broadcaster not found');
    }

    const broadcasterDao = new BroadcasterDao();

    return broadcasterDao.findItem(value).then(broadcaster => {
      if (!broadcaster) {
        return Promise.reject('Broadcaster not found');
      }

      return Promise.resolve();
    });
  }),
  body('user')
    .optional()
    .custom(value => {
      if (!isIdValid(value)) {
        throw new Error('User not found');
      }

      const userDao = new UserDao();

      return userDao.findItem(value).then(user => {
        if (!user) {
          return Promise.reject('User not found');
        }

        return Promise.resolve();
      });
    }),
  body('voice')
    .optional()
    .custom(value => {
      if (!isIdValid(value)) {
        throw new Error('Voice not found');
      }

      const voiceDao = new VoiceDao();

      return voiceDao.findItem(value).then(voice => {
        if (!voice) {
          return Promise.reject('Voice not found');
        }

        return Promise.resolve();
      });
    }),
  body('dialect')
    .optional()
    .custom(value => {
      if (!Object.values(DialectType).includes(value)) {
        throw new Error('Dialect is not valid');
      }

      return true;
    }),
  body('expiredAt')
    .optional()
    .custom(value => {
      const expired = new Date(value);
      const currentDate = new Date();

      if (expired.getTime() < currentDate.getTime()) {
        throw new Error('ExpiredAt must more than current date');
      }

      return true;
    }),
  body('types')
    .optional()
    .custom(value => {
      const typesValid = Object.values(SentenceType).every(t =>
        (value as SentenceType[]).includes(t)
      );

      if (typesValid) {
        throw new Error('Sentence Types is not valid');
      }

      return true;
    }),
];

export const broadcasterIdsValidator = [
  body('ids').custom(value => {
    if (!isIdsValid(value)) {
      throw new BadRequestError(
        'Missing ids or one of broadcaster is not valid'
      );
    }

    const broadcasterDao = new BroadcasterDao();

    return Promise.all(
      (value as string[]).map(async id => {
        const broadcaster = await broadcasterDao.findItem(id);
        return broadcaster;
      })
    ).then(sentences => {
      if (sentences.length > sentences.filter(s => s).length) {
        return Promise.reject('One of broadcasterIds is not valid');
      }

      return Promise.resolve();
    });
  }),
];

export const toggleFinishRecordValidator = [
  body('dialect').custom(value => {
    if (Object.values(DialectType).includes(value)) {
      return true;
    }

    throw new Error('Dialect is not valid');
  }),
];

export const submitErrorBroadcasterSentenceValidator = [
  body('errorMessage')
    .trim()
    .notEmpty()
    .withMessage('Error message is required'),
];
