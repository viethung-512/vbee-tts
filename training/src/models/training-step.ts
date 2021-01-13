import mongoose from 'mongoose';
import { Method } from 'axios';

interface TrainingStepAttrs {
  name: string;
  url: string;
  method?: Method;
  description?: string;
}

interface TrainingStepDoc extends mongoose.Document {
  name: string;
  url: string;
  method?: Method;
  description?: string;
}

interface TrainingStepModel extends mongoose.Model<TrainingStepDoc> {
  build(attrs: TrainingStepAttrs): TrainingStepDoc;
}

const trainingStepSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: 'POST',
    },
    description: {
      type: String,
      required: false,
    },
    url: {
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

trainingStepSchema.statics.build = (attrs: TrainingStepAttrs) => {
  return new TrainingStep(attrs);
};

const TrainingStep = mongoose.model<TrainingStepDoc, TrainingStepModel>(
  'TrainingStep',
  trainingStepSchema
);

export { TrainingStep, TrainingStepAttrs, TrainingStepDoc, TrainingStepModel };
