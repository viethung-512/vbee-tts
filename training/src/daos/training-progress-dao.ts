import { ModelTrainDao } from './model-train-dao';
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
  populate = ['model_train'];

  async createItem(data: TrainingProgressAttrs) {
    const progress = TrainingProgress.build({
      training_id: data.training_id,
      model_train: data.model_train,
      start_time: data.start_time,
      status: data.status,
      progress_args: data.progress_args,
      errorMessage: data.errorMessage,
    });

    await progress.save();

    return progress;
  }

  async updateItem(
    progress: TrainingProgressDoc,
    data: Partial<TrainingProgressAttrs>
  ) {
    const modelTrainDao = new ModelTrainDao();
    if (data.model_train) {
      const modelTrain = await modelTrainDao.findItem(data.model_train);
      if (modelTrain) {
        progress.model_train = modelTrain;
      }
    }
    progress.training_id = data.training_id || progress.training_id;
    progress.start_time = data.start_time || progress.start_time;
    progress.status = data.status || progress.status;
    progress.progress_args = data.progress_args || progress.progress_args;
    progress.errorMessage = data.errorMessage || progress.errorMessage;

    await progress.save();

    return progress;
  }

  async deleteItem(progress: TrainingProgressDoc) {
    const deleted = await TrainingProgress.findByIdAndDelete(progress.id);

    return deleted;
  }
}
