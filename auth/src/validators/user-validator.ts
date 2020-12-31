import { body, param } from 'express-validator';
import { isIdsValid, isIdValid } from '@tts-dev/common';

import { minPassword } from '../configs/auth-config';
import { RoleDao } from '../daos/role-dao';
import { UserDao } from '../daos/user-dao';

export const createUserValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('User name is required')
    .custom(value => {
      const userDao = new UserDao();

      return userDao.findItem({ username: value }).then(user => {
        if (user) {
          return Promise.reject('Username already taken');
        }

        return Promise.resolve();
      });
    }),
  body('email')
    .isEmail()
    .withMessage('Email is not valid')
    .custom(value => {
      const userDao = new UserDao();

      return userDao.findItem({ email: value }).then(user => {
        if (user) {
          return Promise.reject('Email already taken by another user');
        }

        return Promise.resolve();
      });
    }),
  body('phoneNumber')
    .isMobilePhone('vi-VN')
    .withMessage('Phone number is not valid')
    .custom(value => {
      const userDao = new UserDao();

      return userDao.findItem({ phoneNumber: value }).then(user => {
        if (user) {
          return Promise.reject('Phone number already taken by another user');
        }

        return Promise.resolve();
      });
    }),
  body('password')
    .isLength({ min: minPassword })
    .withMessage(`Password must at least ${minPassword} character`),
  body('roleId').custom(value => {
    if (!isIdValid(value)) {
      throw new Error('Role not found');
    }

    const roleDao = new RoleDao();

    return roleDao.findItem(value).then(role => {
      if (!role) {
        return Promise.reject('Role not found');
      }

      return Promise.resolve();
    });
  }),
];

export const updateUserValidator = [
  body('username')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('User name is required')
    .custom((value, { req }) => {
      if (!value) {
        return true;
      }

      const userDao = new UserDao();

      return userDao
        .findItem({ username: value, _id: { $ne: req.params!.id } })
        .then(user => {
          if (user) {
            return Promise.reject('Username already taken');
          }

          return Promise.resolve();
        });
    }),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email is not valid')
    .custom((value, { req }) => {
      if (!value) {
        return true;
      }

      const userDao = new UserDao();

      return userDao
        .findItem({ email: value, _id: { $ne: req.params!.id } })
        .then(user => {
          if (user) {
            return Promise.reject('Email already taken by another user');
          }

          return Promise.resolve();
        });
    }),
  body('phoneNumber')
    .optional()
    .isMobilePhone('vi-VN')
    .withMessage('Phone number is not valid')
    .custom((value, { req }) => {
      if (!value) {
        return true;
      }

      const userDao = new UserDao();

      return userDao
        .findItem({ phoneNumber: value, _id: { $ne: req.params!.id } })
        .then(user => {
          if (user) {
            return Promise.reject('Phone number already taken by another user');
          }

          return Promise.resolve();
        });
    }),
  body('roleId')
    .optional()
    .custom((value, { req }) => {
      if (!value) {
        return true;
      }

      if (!isIdValid(value)) {
        throw new Error('Role not found');
      }

      const roleDao = new RoleDao();

      return roleDao.findItem(value).then(role => {
        if (!role) {
          return Promise.reject('Role not found');
        }

        return Promise.resolve();
      });
    }),
];

export const userIdValidator = [
  param('id').custom(value => {
    if (!isIdValid(value)) {
      throw new Error('User not found');
    }

    return true;
  }),
];

export const userIdsValidator = [
  body('ids').custom((value: string[]) => {
    if (!isIdsValid(value)) {
      throw new Error('Missing ids or one of userId is not valid');
    }

    return true;
  }),
];
