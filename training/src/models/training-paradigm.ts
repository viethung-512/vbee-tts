import mongoose from 'mongoose';
import { Method } from 'axios';

interface TrainingParadigmAttrs {
  name: string;
  steps: {
    uid: number;
    name: string;
    url: string;
    method?: Method;
  }[];
  status: 'active' | 'inactive';
  description?: string;
}

interface TrainingParadigmDoc extends mongoose.Document {
  name: string;
  steps: {
    uid: number;
    name: string;
    url: string;
    method?: Method;
  }[];
  status: 'active' | 'inactive';
  description?: string;
}

interface TrainingParadigmModel extends mongoose.Model<TrainingParadigmDoc> {
  build(attrs: TrainingParadigmAttrs): TrainingParadigmDoc;
}

const trainingParadigmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    steps: [
      {
        uid: Number,
        name: String,
        url: String,
        method: {
          type: String,
          default: 'POST',
        },
      },
    ],
    description: {
      type: String,
      required: false,
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
};
