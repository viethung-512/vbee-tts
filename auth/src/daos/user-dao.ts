import { BaseDao } from '@tts-dev/common';
import { UserAttrs, UserDoc, UserModel, User } from '../models/user';

export class UserDao extends BaseDao<UserDoc, UserModel, UserAttrs> {
  model = User;
  populate = ['role'];

  async createItem(data: UserAttrs) {
    const user = User.build({
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      role: data.role,
    });

    await user.save();
    const newUser = await User.findById(user.id).populate(this.populate);

    return newUser!;
  }

  async updateItem(user: UserDoc, data: Partial<UserAttrs>) {
    user.username = data.username || user.username;
    user.email = data.email || user.email;
    user.phoneNumber = data.phoneNumber || user.phoneNumber;
    user.role = data.role || user.role;
    if (data.password) user.password = data.password;
    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.photoURL = data.photoURL || user.photoURL;
    await user.save();

    await Promise.all(
      this.populate.map(async p => {
        await user.populate(p).execPopulate();
      })
    );

    // const updated = await User.findById(user.id).populate(this.populate);

    return user;
  }

  async deleteItem(user: UserDoc) {
    const deleted = await User.findByIdAndDelete(user.id);

    return deleted;
  }
}
