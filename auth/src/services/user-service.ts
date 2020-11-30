import {
  PaginateQuery,
  PaginateResponse,
  ServiceResponse,
} from '@tts-dev/common';

import { UserDao } from '../daos/user-dao';
import { UserAttrs, UserDoc } from '../models/user';

interface PaginatedUser extends PaginateResponse {
  docs: UserDoc[];
}

interface GetUsersResponse extends ServiceResponse {
  paginatedUsers?: PaginatedUser;
}

interface GetUserResponse extends ServiceResponse {
  user?: UserDoc;
}

interface CreateUserResponse extends ServiceResponse {
  user?: UserDoc;
}

interface UpdateUserResponse extends ServiceResponse {
  user?: UserDoc;
}

interface DeleteUsersResponse extends ServiceResponse {
  users?: UserDoc[];
}

const getUsers = async (query: PaginateQuery): Promise<GetUsersResponse> => {
  const userDao = new UserDao();
  const paginated = await userDao.findAll({ paginateQuery: query });

  return {
    success: true,
    paginatedUsers: paginated,
  };
};

const getUser = async (id: string): Promise<GetUserResponse> => {
  const userDao = new UserDao();
  const user = await userDao.findItem(id);
  if (!user) {
    return { success: false };
  }

  return { success: true, user };
};

const createUser = async (data: UserAttrs): Promise<CreateUserResponse> => {
  const userDao = new UserDao();
  const user = await userDao.createItem(data);

  return { success: true, user };
};

const updateUser = async (
  id: string,
  data: Partial<UserAttrs>
): Promise<UpdateUserResponse> => {
  const userDao = new UserDao();
  let user = await userDao.findItem(id);

  if (!user) {
    return {
      success: false,
      errors: [{ message: 'User not found' }],
    };
  }

  user = await userDao.updateItem(user, data);
  return {
    success: true,
    user,
  };
};

const deleteUsers = async (userIds: string[]): Promise<DeleteUsersResponse> => {
  const userDao = new UserDao();

  const deletedUsers = await Promise.all(
    userIds.map(async userId => {
      const user = await userDao.findItem(userId);
      if (!user) {
        return false;
      }

      await userDao.deleteItem(user);
      return user;
    })
  );
  if (deletedUsers.some(u => u === false)) {
    return {
      success: false,
      errors: [{ message: 'One of users is not valid' }],
    };
  }

  const users = deletedUsers.filter(u => u !== false) as UserDoc[];
  return { success: true, users };
};

const userService = { getUsers, getUser, createUser, updateUser, deleteUsers };

export { userService };
