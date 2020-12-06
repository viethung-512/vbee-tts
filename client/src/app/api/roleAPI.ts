import { PaginateQuery, PaginateResponse } from '@tts-dev/common';
import { Role } from 'app/types/role';
import axiosClient from './axiosClient';

interface CreateRoleData extends Omit<Role, 'id'> {}

interface UpdateRoleData extends Partial<Omit<Role, 'id'>> {}

const getRoles = async (query: PaginateQuery): Promise<PaginateResponse> => {
  return axiosClient.get('/api/roles', {
    params: query,
  });
};

const getRole = async (id: string): Promise<Role> => {
  return axiosClient.get(`/api/roles/${id}`);
};

const createRole = async (data: CreateRoleData): Promise<Role> => {
  return axiosClient.post('/api/roles', {
    ...data,
  });
};

const updateRole = async (id: string, data: UpdateRoleData): Promise<Role> => {
  return axiosClient.put(`/api/roles/update/${id}`, {
    ...data,
  });
};

const approveRoles = async (ids: string[]): Promise<Role[]> => {
  return axiosClient.put('/api/roles/approve', {
    ids: ids,
  });
};

const deleteRoles = async (ids: string[]): Promise<Role[]> => {
  return axiosClient.delete('/api/roles/delete', {
    data: { ids },
  });
};

const roleAPI = {
  getRoles,
  getRole,
  createRole,
  updateRole,
  approveRoles,
  deleteRoles,
};

export default roleAPI;
