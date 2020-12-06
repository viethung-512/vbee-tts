import mongoose from 'mongoose';
// @ts-ignore
import MongooseFuzzySearching from 'mongoose-fuzzy-searching';

import { Password } from '../services/password';
import { RoleDoc } from './role';

interface UserAttrs {
  username: string;
  email: string;
  phoneNumber: string;
  role: RoleDoc;
  password: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
}

interface UserDoc extends mongoose.Document {
  username: string;
  email: string;
  phoneNumber: string;
  role: RoleDoc;
  password: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    photoURL: { type: String },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;

        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
    timestamps: true,
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
    // @ts-ignore
    done();
  }
});

userSchema.plugin(MongooseFuzzySearching, {
  fields: ['username', 'email', 'phoneNumber'],
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User, UserAttrs, UserDoc, UserModel };
