import mongoose from 'mongoose';
import { HistoryEntity, HistoryEvent } from '@tts-dev/common';
import { UserDoc } from './user';

interface HistoryAttrs {
  event: HistoryEvent;
  entity: HistoryEntity;
  user: UserDoc;
  sentence?: any;
  record?: any;
}

interface HistoryDoc extends mongoose.Document {
  event: HistoryEvent;
  entity: HistoryEntity;
  user: UserDoc;
  sentence?: any;
  record?: any;
}

interface HistoryModel extends mongoose.Model<HistoryDoc> {
  build(attrs: HistoryAttrs): HistoryDoc;
}

const historySchema = new mongoose.Schema(
  {
    event: String,
    entity: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sentence: mongoose.Schema.Types.Mixed,
    record: mongoose.Schema.Types.Mixed,
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

historySchema.statics.build = (attrs: HistoryAttrs) => {
  return new History(attrs);
};

const History = mongoose.model<HistoryDoc, HistoryModel>(
  'History',
  historySchema
);

export { History, HistoryAttrs, HistoryDoc, HistoryModel };
