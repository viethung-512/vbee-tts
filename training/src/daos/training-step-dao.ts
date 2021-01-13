import { BaseDao } from '@tts-dev/common';
import {
  TrainingStep,
  TrainingStepModel,
  TrainingStepDoc,
  TrainingStepAttrs,
} from '../models/training-step';

export class TrainingStepDao extends BaseDao<
  TrainingStepDoc,
  TrainingStepModel,
  TrainingStepAttrs
> {
  model = TrainingStep;
  populate = [];

  async createItem(data: TrainingStepAttrs) {
    const step = TrainingStep.build({
      name: data.name,
      description: data.description,
      url: data.url,
      method: data.method,
    });

    await step.save();

    return step;
  }

  async updateItem(step: TrainingStepDoc, data: Partial<TrainingStepAttrs>) {
    step.name = data.name || step.name;
    step.url = data.url || step.url;
    step.description = data.description || step.description;
    step.method = data.method || step.method;

    await step.save();

    return step;
  }

  async deleteItem(step: TrainingStepDoc) {
    const deleted = await TrainingStep.findByIdAndDelete(step.id);

    return deleted;
  }
}
