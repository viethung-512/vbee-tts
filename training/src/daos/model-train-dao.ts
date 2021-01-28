import { BaseDao } from '@tts-dev/common';
import {
  ModelTrain,
  ModelTrainAttrs,
  ModelTrainDoc,
  ModelTrainModel,
} from '../models/model-train';

export class ModelTrainDao extends BaseDao<
  ModelTrainDoc,
  ModelTrainModel,
  ModelTrainAttrs
> {
  model = ModelTrain;
  populate = [];

  async createItem(data: ModelTrainAttrs) {
    const modelTrain = ModelTrain.build({
      name: data.name,
      steps: data.steps,
      description: data.description,
      curr_training_id: data.curr_training_id,
    });

    await modelTrain.save();

    return modelTrain;
  }

  async updateItem(modelTrain: ModelTrainDoc, data: Partial<ModelTrainAttrs>) {
    modelTrain.name = data.name || modelTrain.name;
    modelTrain.steps = data.steps || modelTrain.steps;
    modelTrain.description = data.description || modelTrain.description;
    modelTrain.curr_training_id =
      data.curr_training_id || modelTrain.curr_training_id;

    await modelTrain.save();

    return modelTrain;
  }

  async deleteItem(modelTrain: ModelTrainDoc) {
    const deleted = await ModelTrain.findByIdAndDelete(modelTrain.id);

    return deleted;
  }
}
