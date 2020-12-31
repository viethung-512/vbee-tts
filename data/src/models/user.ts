import mongoose from 'mongoose';
import { Action, Resource } from '@tts-dev/common';
// @ts-ignore
import MongooseFuzzySearching from 'mongoose-fuzzy-searching';

interface UserAttrs {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: {
    id: string;
    name: string;
    resources: {
      name: Resource;
      actions: Action[];
    }[];
    policy: string | null;
  };
  photoURL?: string;
}

interface UserDoc extends mongoose.Document {
  username: string;
  email: string;
  phoneNumber: string;
  role: {
    id: string;
    name: string;
    resources: {
      name: Resource;
      actions: Action[];
    }[];
    policy: string | null;
  };
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
    role: {
      name: String,
      resources: [
        {
          name: String,
          actions: [String],
        },
      ],
      policy: String,
    },
    photoURL: String,
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;

        delete ret._id;
      },
      versionKey: false,
    },
    timestamps: true,
  }
);

userSchema.plugin(MongooseFuzzySearching, {
  fields: ['username', 'email', 'phoneNumber'],
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User({
    _id: attrs.id,
    username: attrs.username,
    email: attrs.email,
    phoneNumber: attrs.phoneNumber,
    role: {
      id: attrs.role.id,
      name: attrs.role.name,
      resources: attrs.role.resources,
      policy: attrs.role.policy,
    },
    photoURL: attrs.photoURL,
  });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User, UserAttrs, UserDoc, UserModel };
