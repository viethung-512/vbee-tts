import { BaseDao } from '@tts-dev/common';
import {
  TrainingProgress,
  TrainingProgressModel,
  TrainingProgressDoc,
  TrainingProgressAttrs,
} from '../models/training-progress';

export class TrainingProgressDao extends BaseDao<
  TrainingProgressDoc,
  TrainingProgressModel,
  TrainingProgressAttrs
> {
  model = TrainingProgress;
  populate = ['steps.step', 'paradigm'];

  async createItem(data: TrainingProgressAttrs) {
    const currentProgress = TrainingProgress.build({
      training_id: data.training_id,
      paradigm: data.paradigm,
      steps: data.steps,
    });

    await currentProgress.save();

    return currentProgress;
  }

  async updateItem(
    progress: TrainingProgressDoc,
    data: Partial<TrainingProgressAttrs>
  ) {
    progress.training_id = data.training_id || progress.training_id;
    progress.paradigm = data.paradigm || progress.paradigm;
    progress.steps = data.steps || progress.steps;

    await progress.save();

    return progress;
  }

  async deleteItem(progress: TrainingProgressDoc) {
    const deleted = await TrainingProgress.findByIdAndDelete(progress.id);

    return deleted;
  }
}
