import mongoose from 'mongoose';
import { TrainingStepDoc } from './training-step';

interface TrainingStepParadigm {
  step: TrainingStepDoc;
  uid: number;
}

interface TrainingParadigmAttrs {
  name: string;
  steps: TrainingStepParadigm[];
  status: 'active' | 'inactive';
  description?: string;
}

interface TrainingParadigmDoc extends mongoose.Document {
  name: string;
  steps: TrainingStepParadigm[];
  status: 'active' | 'inactive';
  description?: string;
}

interface TrainingParadigmModel extends mongoose.Model<TrainingParadigmDoc> {
  build(attrs: TrainingParadigmAttrs): TrainingParadigmDoc;
}

const trainingParadigmSchema = new mongoose.Schema(
  {
    name: String,
    status: String,
    steps: [
      {
        step: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'TrainingStep',
        },
        uid: Number,
      },
    ],
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
    timestamps: true,
  }
);

trainingParadigmSchema.statics.build = (attrs: TrainingParadigmAttrs) => {
  return new TrainingParadigm(attrs);
};

const TrainingParadigm = mongoose.model<
  TrainingParadigmDoc,
  TrainingParadigmModel
>('TrainingParadigm', trainingParadigmSchema);

export {
  TrainingParadigm,
  TrainingParadigmAttrs,
  TrainingParadigmDoc,
  TrainingParadigmModel,
  TrainingStepParadigm,
};
