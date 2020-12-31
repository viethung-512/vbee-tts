import axiosClient from './axiosClient';
import { PaginateQuery, PaginateResponse } from '@tts-dev/common';
import { User } from 'app/types/user';

export interface CreateUserData extends Omit<Omit<User, 'id'>, 'role'> {
  roleId: string;
  password: string;
}

export interface UpdateUserData
  extends Partial<Omit<Omit<User, 'id'>, 'role'>> {
  roleId: string;
}

const getUsers = async (query: PaginateQuery): Promise<PaginateResponse> => {
  return axiosClient.get('/api/users', {
    params: query,
  });
};

const getUser = async (id: string): Promise<User> => {
  return axiosClient.get(`/api/users/${id}`);
};

const createUser = async (data: CreateUserData): Promise<User> => {
  return axiosClient.post('/api/users', {
    ...data,
  });
};

const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  return axiosClient.put(`/api/users/update/${id}`, {
    ...data,
  });
};

const deleteUsers = async (ids: string[]): Promise<User[]> => {
  return axiosClient.delete('/api/users/delete', {
    data: { ids },
  });
};

const userAPI = { getUsers, getUser, createUser, updateUser, deleteUsers };

export default userAPI;
