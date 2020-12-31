import mongoose from 'mongoose';
// @ts-ignore
import MongooseFuzzySearching from 'mongoose-fuzzy-searching';

interface VoiceAttrs {
  name: string;
  code: string;
}

interface VoiceDoc extends mongoose.Document {
  name: string;
  code: string;
}

interface VoiceModel extends mongoose.Model<VoiceDoc> {
  build(attrs: VoiceAttrs): VoiceDoc;
}

const voiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
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

voiceSchema.plugin(MongooseFuzzySearching, {
  fields: ['name', 'code'],
});

voiceSchema.statics.build = (attrs: VoiceAttrs) => {
  return new Voice(attrs);
};

const Voice = mongoose.model<VoiceDoc, VoiceModel>('Voice', voiceSchema);

export { Voice, VoiceAttrs, VoiceDoc, VoiceModel };
