import { User } from 'app/types/user';
import axiosClient from './axiosClient';

export type UpdateAuthProfileField = Partial<
  Pick<User, 'firstName' | 'lastName' | 'username'>
>;

const login = async (
  phoneNumber: string,
  password: string
): Promise<{
  user: User;
  token: string;
}> => {
  return axiosClient.post('/api/auth/login', { phoneNumber, password });
};

const logout = async () => {
  return axiosClient.post('/api/auth/logout');
};

const getMe = async (): Promise<User> => {
  return axiosClient.get('/api/auth/me');
};

const updatePassword = async (
  oldPass: string,
  newPass: string
): Promise<boolean> => {
  return axiosClient.put('/api/auth/change-password', {
    oldPassword: oldPass,
    newPassword: newPass,
  });
};

const updateAuthInfo = async (
  id: string,
  data: UpdateAuthProfileField
): Promise<User> => {
  return axiosClient.put(`/api/users/update/${id}`, {
    ...data,
  });
};

const uploadAvatarProfile = async (image: File): Promise<User> => {
  const formData = new FormData();
  formData.append('avatar', image);

  return axiosClient.put('/api/auth/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const checkBroadcaster = async (): Promise<{ data: boolean }> => {
  return axiosClient.get('/api/broadcasters/isBroadcaster');
};

const authAPI = {
  login,
  logout,
  getMe,
  updateAuthInfo,
  updatePassword,
  uploadAvatarProfile,
  checkBroadcaster,
};

export default authAPI;
