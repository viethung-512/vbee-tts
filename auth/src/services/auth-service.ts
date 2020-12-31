import jwt from 'jsonwebtoken';
import { UploadedFile } from 'express-fileupload';
import { ServiceResponse } from '@tts-dev/common';

import { Password } from '../services/password';
import { UserDoc } from '../models/user';
import { UserDao } from '../daos/user-dao';
import { uploadAPI } from '../api/uploadAPI';
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

interface LoginResponse extends ServiceResponse {
  data?: {
    user: UserDoc;
    token: string;
  };
}

interface GetMeResponse extends ServiceResponse {
  user?: UserDoc;
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

const getMe = async (id?: string): Promise<GetMeResponse> => {
  if (!id) {
    return {
      success: false,
      errors: [{ message: 'User not found' }],
    };
  }

  const userDao = new UserDao();
  const user = await userDao.findItem(id);
  if (!user) {
    return {
      success: false,
      errors: [{ message: 'User not found' }],
    };
  }

  return { success: true, user };
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

  const photoURL = await uploadAPI.uploadFile(file, `images/users/${userId}`);
  user.photoURL = photoURL;
  await user.save();

  await new UserUpdatedPublisher(natsWrapper.client).publish({
    id: user.id!,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    role: {
      id: user.role.id!,
      name: user.role.name,
      resources: user.role.resources,
      policy: user.role.policy.official_version,
    },
  });

  return { success: true, user: user };
};

const authService = { login, getMe, changePassword, uploadAvatar };

export { authService };
