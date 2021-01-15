import mongoose from 'mongoose';
import { TrainingStepDoc } from './training-step';
import { TrainingParadigmDoc } from './training-paradigm';

type TrainingStepProgress = {
  step: TrainingStepDoc;
  status: 'waiting' | 'processing' | 'success' | 'error';
  start_time?: string;
  errorMessage?: string;
};

interface TrainingProgressAttrs {
  training_id: string;
  paradigm: TrainingParadigmDoc;
  steps: TrainingStepProgress[];
}

interface TrainingProgressDoc extends mongoose.Document {
  training_id: string;
  paradigm: TrainingParadigmDoc;
  steps: TrainingStepProgress[];
}

interface TrainingProgressModel extends mongoose.Model<TrainingProgressDoc> {
  build(attrs: TrainingProgressAttrs): TrainingProgressDoc;
}

const trainingProgressSchema = new mongoose.Schema(
  {
    training_id: String,
    paradigm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingParadigm',
    },
    steps: [
      {
        step: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingStep' },
        status: String,
        errorMessage: String,
        start_time: String,
      },
    ],
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

trainingProgressSchema.statics.build = (attrs: TrainingProgressAttrs) => {
  return new TrainingProgress(attrs);
};

const TrainingProgress = mongoose.model<
  TrainingProgressDoc,
  TrainingProgressModel
>('TrainingProgress', trainingProgressSchema);

export {
  TrainingProgress,
  TrainingProgressAttrs,
  TrainingProgressDoc,
  TrainingProgressModel,
  TrainingStepProgress,
};
