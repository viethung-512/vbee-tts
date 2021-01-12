import mongoose from 'mongoose';
import { Action, DialectType, Resource, SentenceType } from '@tts-dev/common';
// @ts-ignore
import MongooseFuzzySearching from 'mongoose-fuzzy-searching';

interface User {
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
}

interface Voice {
  id: string;
  name: string;
  code: string;
}

interface BroadcasterAttrs {
  types: SentenceType[];
  completed: string[];
  user: User;
  voice: Voice;
  dialect: DialectType;
  expiredAt: Date;
}

interface BroadcasterDoc extends mongoose.Document {
  types: SentenceType[];
  completed: string[];
  user: User;
  voice: Voice;
  dialect: DialectType;
  expiredAt: Date;
  progresses: {
    type: SentenceType;
    total: number;
    current: number;
    percent: number;
  }[];
}

interface BroadcasterModel extends mongoose.Model<BroadcasterDoc> {
  build(attrs: BroadcasterAttrs): BroadcasterDoc;
}

const broadcasterSchema = new mongoose.Schema(
  {
    types: [String],
    completed: [String],
    user: {
      id: String,
      username: String,
      email: String,
      phoneNumber: String,
      role: {
        name: String,
        resources: [
          {
            name: String,
            actions: [String],
          },
        ],
      },
    },
    voice: {
      id: String,
      name: String,
      code: String,
    },
    dialect: String,
    expiredAt: Date,
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

broadcasterSchema.plugin(MongooseFuzzySearching, {
  fields: [
    {
      name: 'user',
      keys: ['username', 'email', 'phoneNumber'],
    },
    {
      name: 'voice',
      keys: ['name', 'code'],
    },
  ],
});

broadcasterSchema.statics.build = (attrs: BroadcasterAttrs) => {
  return new Broadcaster(attrs);
};

const Broadcaster = mongoose.model<BroadcasterDoc, BroadcasterModel>(
  'Broadcaster',
  broadcasterSchema
);

interface BroadcasterSentence {
  id: string;
  uid: number;
  type: SentenceType;
  dialect: DialectType;
  completed: boolean;
  original: string;
  pronunciation: string;
  originalImage?: string;
  dialectImage?: string;
}

export {
  Broadcaster,
  BroadcasterAttrs,
  BroadcasterDoc,
  BroadcasterModel,
  BroadcasterSentence,
};
