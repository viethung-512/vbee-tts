import mongoose from 'mongoose';
import { ModelTrainDoc } from './model-train';

interface TrainingProgressAttrs {
  training_id: string;
  start_time: string;
  status: 'progressing' | 'completed' | 'error';
  model_train: string;
  progress_args: {
    required_args: {
      voice: string;
      corpora: string[];
    };
    optional_args: {
      [uid: number]: {
        [argKey: string]: any;
      };
    };
  };
  errorMessage?: string;
}

interface TrainingProgressDoc extends mongoose.Document {
  training_id: string;
  start_time: string;
  status: 'progressing' | 'completed' | 'error';
  model_train: ModelTrainDoc;
  progress_args: {
    required_args: {
      voice: string;
      corpora: string[];
    };
    optional_args: {
      [uid: number]: {
        [argKey: string]: any;
      };
    };
  };
  errorMessage?: string;
}

interface TrainingProgressModel extends mongoose.Model<TrainingProgressDoc> {
  build(attrs: TrainingProgressAttrs): TrainingProgressDoc;
}

const trainingProgressSchema = new mongoose.Schema(
  {
    training_id: String,
    start_time: String,
    status: String,
    model_train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ModelTrain',
    },
    progress_args: {
      required_args: {
        voice: String,
        corpora: [String],
      },
      optional_args: mongoose.Schema.Types.Mixed,
    },
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
};
