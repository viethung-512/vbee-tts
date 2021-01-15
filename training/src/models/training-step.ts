import mongoose from 'mongoose';

interface TrainingStepAttrs {
  name: string;
  url: string;
  paramFields: string[];
  description?: string;
}

interface TrainingStepDoc extends mongoose.Document {
  name: string;
  url: string;
  paramFields: string[];
  description?: string;
}

interface TrainingStepModel extends mongoose.Model<TrainingStepDoc> {
  build(attrs: TrainingStepAttrs): TrainingStepDoc;
}

const trainingStepSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    paramFields: [String],
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

trainingStepSchema.statics.build = (attrs: TrainingStepAttrs) => {
  return new TrainingStep(attrs);
};

const TrainingStep = mongoose.model<TrainingStepDoc, TrainingStepModel>(
  'TrainingStep',
  trainingStepSchema
);

export { TrainingStep, TrainingStepAttrs, TrainingStepDoc, TrainingStepModel };
