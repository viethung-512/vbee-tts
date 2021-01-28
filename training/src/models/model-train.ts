import mongoose from 'mongoose';
// @ts-ignore
import MongooseFuzzySearching from 'mongoose-fuzzy-searching';
import { TrainingStep } from '@tts-dev/common';

interface ModelTrainAttrs {
  name: string;
  steps: TrainingStep[];
  curr_training_id: string | null;
  description?: string;
}

interface ModelTrainDoc extends mongoose.Document {
  name: string;
  steps: TrainingStep[];
  curr_training_id: string | null;
  description?: string;
}

interface ModelTrainModel extends mongoose.Model<ModelTrainDoc> {
  build(attrs: ModelTrainAttrs): ModelTrainDoc;
}

const modelTrainSchema = new mongoose.Schema(
  {
    name: String,
    steps: [
      {
        index: Number,
        name: String,
        key: String,
        url: String,
        description: String,
      },
    ],
    curr_training_id: String,
    description: String,
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

modelTrainSchema.plugin(MongooseFuzzySearching, {
  fields: ['name'],
});

modelTrainSchema.statics.build = (attrs: ModelTrainAttrs) => {
  return new ModelTrain(attrs);
};

const ModelTrain = mongoose.model<ModelTrainDoc, ModelTrainModel>(
  'ModelTrain',
  modelTrainSchema
);

export { ModelTrain, ModelTrainAttrs, ModelTrainDoc, ModelTrainModel };
