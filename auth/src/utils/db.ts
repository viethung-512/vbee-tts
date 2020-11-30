import mongoose from 'mongoose';
import { rootRole } from '@tts-dev/common';

import { RoleDao } from '../daos/role-dao';
import { UserDao } from '../daos/user-dao';
import { Role } from '../models/role';
import { getEnv } from '../configs/env-config';
import { User } from '../models/user';

const initDB = async () => {
  const roleDao = new RoleDao();
  const userDao = new UserDao();
  const { rootUser } = getEnv();

  let role = await roleDao.findItem({ name: rootRole.name });
  if (!role) {
    role = Role.build(rootRole);
    await role.save();
  }

  let user = await userDao.findItem({
    email: rootUser.email,
    phoneNumber: rootUser.phoneNumber,
    username: rootUser.username,
  });
  if (!user) {
    user = User.build({
      username: rootUser.username,
      email: rootUser.email,
      phoneNumber: rootUser.phoneNumber,
      password: rootUser.password,
      role,
    });
    await user.save();
  }
};

export const connectDB = async () => {
  const { mongo } = getEnv();

  try {
    await mongoose.connect(mongo.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    await initDB();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
