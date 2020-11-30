import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '@tts-dev/common';

import { userService } from '../services/user-service';

const getUsers = async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;
  const { success, errors, paginatedUsers } = await userService.getUsers({
    search: search?.toString(),
    page: page ? parseInt(page.toString()) : undefined,
    limit: limit ? parseInt(limit.toString()) : undefined,
  });

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(paginatedUsers);
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, user } = await userService.getUser(id);
  if (!success) {
    throw new NotFoundError('User not found');
  }

  res.status(200).send(user);
};

const createUser = async (req: Request, res: Response) => {
  const { username, email, phoneNumber, password, roleId } = req.body;

  const { success, errors, user } = await userService.createUser({
    username,
    email,
    phoneNumber,
    password,
    role: roleId,
  });
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(201).send(user);
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    username,
    email,
    phoneNumber,
    firstName,
    lastName,
    roleId,
  } = req.body;
  const { success, errors, user } = await userService.updateUser(id, {
    username,
    firstName,
    lastName,
    email,
    phoneNumber,
    role: roleId,
  });
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(user);
};

const deleteUsers = async (req: Request, res: Response) => {
  const { ids } = req.body;

  const { success, errors, users } = await userService.deleteUsers(ids);
  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(users);
};

const userController = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUsers,
};

export { userController };
