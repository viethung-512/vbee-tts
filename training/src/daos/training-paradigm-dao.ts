import { BaseDao } from '@tts-dev/common';
import {
  TrainingParadigm,
  TrainingParadigmModel,
  TrainingParadigmDoc,
  TrainingParadigmAttrs,
} from '../models/training-paradigm';

export class TrainingParadigmDao extends BaseDao<
  TrainingParadigmDoc,
  TrainingParadigmModel,
  TrainingParadigmAttrs
> {
  model = TrainingParadigm;
  populate = [];

  async createItem(data: TrainingParadigmAttrs) {
    const paradigm = TrainingParadigm.build({
      name: data.name,
      steps: data.steps,
      description: data.description,
      status: data.status,
    });

    await paradigm.save();

    return paradigm;
  }

  async updateItem(
    paradigm: TrainingParadigmDoc,
    data: Partial<TrainingParadigmAttrs>
  ) {
    paradigm.name = data.name || paradigm.name;
    paradigm.steps = data.steps || paradigm.steps;
    paradigm.description = data.description || paradigm.description;
    paradigm.status = data.status || paradigm.status;

    await paradigm.save();

    return paradigm;
  }

  async deleteItem(step: TrainingParadigmDoc) {
    const deleted = await TrainingParadigm.findByIdAndDelete(step.id);

    return deleted;
  }
}
