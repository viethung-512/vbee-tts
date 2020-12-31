import { body, param } from 'express-validator';
import {
  BadRequestError,
  FieldError,
  isIdsValid,
  isIdValid,
  NotFoundError,
  SentenceType,
} from '@tts-dev/common';
import { SentenceDao } from '../daos/sentence-dao';
import { UserDao } from '../daos/user-dao';

interface ValidatorResult {
  isValid: boolean;
  errors?: FieldError[];
}

export const sentenceIdValidator = [
  param('id').custom(value => {
    if (!isIdValid(value)) {
      throw new NotFoundError('Sentence Not found');
    }

    return true;
  }),
];

export const sentenceIdsValidator = [
  body('ids').custom(value => {
    if (!isIdsValid(value)) {
      throw new BadRequestError(
        'Missing ids or one of sentenceId is not valid'
      );
    }

    const sentenceDao = new SentenceDao();

    return Promise.all(
      (value as string[]).map(async id => {
        const sentence = await sentenceDao.findItem(id);
        return sentence;
      })
    ).then(sentences => {
      if (sentences.length > sentences.filter(s => s).length) {
        return Promise.reject('One of sentenceIds is not valid');
      }

      return Promise.resolve();
    });
  }),
];

export const submitErrorValidator = [
  body('errorMessage')
    .trim()
    .notEmpty()
    .withMessage('Error Message is required'),
];

export const assignValidator = [
  body('checker').custom(value => {
    if (!isIdValid(value)) {
      throw new NotFoundError('User Not found');
    }

    const userDao = new UserDao();
    return userDao.findItem(value).then(user => {
      if (!user) {
        return Promise.reject('User not found');
      }

      return Promise.resolve();
    });
  }),
  body('ids')
    .optional()
    .custom(value => {
      if (!isIdsValid(value)) {
        throw new BadRequestError(
          'Missing ids or one of sentenceId is not valid'
        );
      }

      const sentenceDao = new SentenceDao();

      return Promise.all(
        (value as string[]).map(async id => {
          const sentence = await sentenceDao.findItem(id);
          return sentence;
        })
      ).then(sentences => {
        if (sentences.length > sentences.filter(s => s).length) {
          return Promise.reject('One of sentenceIds is not valid');
        }

        return Promise.resolve();
      });
    }),
  body('count').optional().isNumeric().withMessage('Count is not valid'),
  body('type')
    .optional()
    .custom(value => {
      if (!Object.values(SentenceType).includes(value)) {
        throw new Error('Sentence type is not valid');
      }

      return true;
    }),
];

export const importValidator = (importContent: any): ValidatorResult => {
  if (!Array.isArray(importContent)) {
    return {
      isValid: false,
      errors: [{ message: 'Import Data is not valid' }],
    };
  }

  const isValid = importContent.every(imp => {
    return (
      typeof imp === 'object' &&
      imp.hasOwnProperty('content') &&
      imp.hasOwnProperty('type') &&
      Object.values(SentenceType).includes(imp['type'])
    );
  });

  if (!isValid) {
    return {
      isValid: false,
      errors: [{ message: 'Import Data is not valid' }],
    };
  }

  return { isValid: true };
};
