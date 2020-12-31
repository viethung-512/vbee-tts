import { BaseDao } from '@tts-dev/common';
import { UserAttrs, UserDoc, UserModel, User } from '../models/user';

export class UserDao extends BaseDao<UserDoc, UserModel, UserAttrs> {
  model = User;
  populate = [];

  async createItem(data: UserAttrs) {
    const user = User.build({
      id: data.id,
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: data.role,
    });

    await user.save();

    return user;
  }

  async updateItem(user: UserDoc, data: Partial<UserAttrs>) {
    user.username = data.username || user.username;
    user.email = data.email || user.email;
    user.phoneNumber = data.phoneNumber || user.phoneNumber;
    user.role = data.role || user.role;
    await user.save();

    return user;
  }

  async deleteItem(user: UserDoc) {
    const deleted = await User.findByIdAndDelete(user.id);

    return deleted;
  }
}
