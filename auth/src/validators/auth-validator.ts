import { body } from 'express-validator';
import { minPassword } from '../configs/auth-config';

export const loginValidator = [
  body('phoneNumber')
    .isMobilePhone('vi-VN')
    .withMessage('Must be a valid phone number'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

export const changePasswordValidator = [
  body('oldPassword').trim().notEmpty().withMessage('Old password is required'),
  body('newPassword')
    .isLength({ min: minPassword })
    .withMessage(`Password must at least ${minPassword} character`),
];
