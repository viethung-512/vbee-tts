import jwt from 'jsonwebtoken';
import { UploadedFile } from 'express-fileupload';
import { v4 as uuid } from 'uuid';
import { ServiceResponse } from '@tts-dev/common';

import { Password } from '../services/password';
import { UserDoc } from '../models/user';
import { UserDao } from '../daos/user-dao';
import { getEnv } from '../configs/env-config';

interface LoginResponse extends ServiceResponse {
  data?: {
    user: UserDoc;
    token: string;
  };
}

interface ChangePasswordResponse extends ServiceResponse {}

interface UploadAvatarResponse extends ServiceResponse {
  user?: UserDoc;
}

const login = async (
  phoneNumber: string,
  password: string
): Promise<LoginResponse> => {
  const userDao = new UserDao();

  const user = await userDao.findItem({ phoneNumber });
  if (!user) {
    return {
      success: false,
      errors: [
        {
          field: 'phoneNumber',
          message: 'Phone number does not exists',
        },
      ],
    };
  }

  const correctPassword = await Password.compare(user.password, password);
  if (!correctPassword) {
    return {
      success: false,
      errors: [
        {
          field: 'password',
          message: 'Password is incorrect',
        },
      ],
    };
  }

  const userJwt = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!
  );

  return {
    success: true,
    data: {
      user,
      token: userJwt,
    },
  };
};

const getMe = async (id?: string): Promise<UserDoc | null> => {
  if (!id) {
    return null;
  }

  const userDao = new UserDao();
  const user = await userDao.findItem(id);

  return user;
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  const userDao = new UserDao();

  const user = await userDao.findItem(userId);
  if (!user) {
    return {
      success: false,
      errors: [{ message: 'User not found' }],
    };
  }

  const correctPassword = await Password.compare(user.password, oldPassword);
  if (!correctPassword) {
    return {
      success: false,
      errors: [{ field: 'oldPassword', message: 'Password is not correct' }],
    };
  }

  if (oldPassword === newPassword) {
    return {
      success: false,
      errors: [
        {
          field: 'newPassword',
          message: 'New password must difference old password',
        },
      ],
    };
  }

  user.password = newPassword;
  await user.save();

  return { success: true };
};

const uploadAvatar = async (
  userId: string,
  file: UploadedFile
): Promise<UploadAvatarResponse> => {
  const userDao = new UserDao();
  const user = await userDao.findItem(userId);

  if (!user) {
    return {
      success: false,
      errors: [{ message: 'User not found' }],
    };
  }

  const fileExtension = file.mimetype.split('/')[
    file.mimetype.split('/').length - 1
  ];
  const randomFileName = `${uuid()}.${fileExtension}`;

  file.mv(`./public/images/${userId}/` + randomFileName);
  const { staticURL } = getEnv();
  const photoURL = `${staticURL}/images/${userId}/${randomFileName}`;

  user.photoURL = photoURL;
  await user.save();

  return { success: true, user };
};

const authService = { login, getMe, changePassword, uploadAvatar };

export { authService };
