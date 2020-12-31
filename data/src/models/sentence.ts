import mongoose from 'mongoose';
// @ts-ignore
import MongooseFuzzySearching from 'mongoose-fuzzy-searching';
import AutoIncrementFactory from 'mongoose-sequence';
import { DialectType, SentenceType, SentenceStatus } from '@tts-dev/common';
import { UserDoc } from './user';

// @ts-ignore
const AutoIncrement = AutoIncrementFactory(mongoose);

interface SentenceAttrs {
  manual_uid?: number;
  raw: string;
  original: string;
  type: SentenceType;
  status: SentenceStatus;
  dialects: {
    name: DialectType;
    pronunciation: string;
    image?: string;
    originalImage?: string;
  }[];
  checker?: UserDoc;
  errorMessage?: string;
}

interface SentenceDoc extends mongoose.Document {
  uid: number;
  manual_uid?: number;
  raw: string;
  original: string;
  type: SentenceType;
  status: SentenceStatus;
  dialects: {
    name: DialectType;
    pronunciation: string;
    image?: string;
    originalImage?: string;
  }[];
  checker?: UserDoc;
  errorMessage?: string;
}

interface SentenceModel extends mongoose.Model<SentenceDoc> {
  build(attrs: SentenceAttrs): SentenceDoc;
}

const sentenceSchema = new mongoose.Schema(
  {
    raw: {
      type: String,
      required: true,
      trim: true,
    },
    manual_uid: Number,
    original: String,
    type: String,
    status: String,
    checker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dialects: [
      {
        name: String,
        image: String,
        originalImage: String,
        pronunciation: String,
      },
    ],
    errorMessage: String,
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

// @ts-ignore
sentenceSchema.plugin(AutoIncrement, { id: 'sentence_uid', inc_field: 'uid' });
sentenceSchema.plugin(MongooseFuzzySearching, {
  fields: ['original'],
});

sentenceSchema.statics.build = (attrs: SentenceAttrs) => {
  return new Sentence(attrs);
};

const Sentence = mongoose.model<SentenceDoc, SentenceModel>(
  'Sentence',
  sentenceSchema
);

export { Sentence, SentenceAttrs, SentenceDoc, SentenceModel };
