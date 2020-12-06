import { Request, Response } from 'express';
import { authService } from '../services/auth-service';
import { BadRequestError } from '@tts-dev/common';

const login = async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body;
  const { success, data, errors } = await authService.login(
    phoneNumber,
    password
  );

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  const { user, token } = data!;
  req.session = { jwt: token };
  res.status(200).send(user);
};

const logout = async (req: Request, res: Response) => {
  req.session = null;
  res.send({ message: 'Log out success' });
};

const getMe = async (req: Request, res: Response) => {
  const user = await authService.getMe(req.authUser!.id);
  res.send(user);
};

const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  const { success, errors } = await authService.changePassword(
    req.authUser!.id,
    oldPassword,
    newPassword
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  req.session = null;
  res.status(200).send(true);
};

const uploadAvatar = async (req: Request, res: Response) => {
  if (!req.files) {
    throw new BadRequestError('Bad Request', [{ message: 'No avatar found' }]);
  }

  const avatar = req.files.avatar;

  const { success, user, errors } = await authService.uploadAvatar(
    req.authUser!.id!,
    avatar
  );
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.send(user);
};

const authController = { login, logout, getMe, changePassword, uploadAvatar };

export { authController };
