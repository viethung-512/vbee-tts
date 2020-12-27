import mongoose from 'mongoose';
import { SentenceType, SentenceStatus, DialectType } from '@tts-dev/common';
// @ts-ignore
import MongooseFuzzySearching from 'mongoose-fuzzy-searching';

import { UserDoc } from './user';
import { SentenceDoc } from './sentence';
import { VoiceDoc } from './voice';

interface RecordAttrs {
  uid: number;
  original: string;
  type: SentenceType;
  status: SentenceStatus;
  sentence: SentenceDoc;
  voice: VoiceDoc;
  dialect: DialectType;
  audioURL?: string | null;
  allophoneContent?: string;
  checker?: UserDoc;
  errorMessage?: string;
}

interface RecordDoc extends mongoose.Document {
  uid: number;
  original: string;
  type: SentenceType;
  status: SentenceStatus;
  sentence: SentenceDoc;
  voice: VoiceDoc;
  audioURL?: string | null;
  allophoneContent?: string;
  checker?: UserDoc;
  dialect: DialectType;
  errorMessage?: string;
}

interface RecordModel extends mongoose.Model<RecordDoc> {
  build(attrs: RecordAttrs): RecordDoc;
}

const recordSchema = new mongoose.Schema(
  {
    uid: Number,
    original: String,
    type: String,
    status: String,
    sentence: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sentence',
    },
    voice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voice',
    },
    audioURL: String,
    allophoneContent: String,
    checker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dialect: String,
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

recordSchema.plugin(MongooseFuzzySearching, { fields: ['original'] });

recordSchema.statics.build = (attrs: RecordAttrs) => {
  return new Record(attrs);
};

const Record = mongoose.model<RecordDoc, RecordModel>('Record', recordSchema);

export { Record, RecordAttrs, RecordDoc, RecordModel };
