import { BaseDao } from '@tts-dev/common';
import {
  HistoryAttrs,
  HistoryDoc,
  HistoryModel,
  History,
} from '../models/history';

export class HistoryDao extends BaseDao<
  HistoryDoc,
  HistoryModel,
  HistoryAttrs
> {
  model = History;
  populate = ['user'];

  async createItem(data: HistoryAttrs) {
    const history = History.build({
      event: data.event,
      entity: data.entity,
      sentence: data.sentence,
      record: data.record,
      user: data.user,
    });

    await history.save();
    const newHistory = await History.findById(history.id).populate(
      this.populate
    );

    return newHistory!;
  }

  async updateItem(history: HistoryDoc, data: Partial<HistoryAttrs>) {
    history.entity = data.entity || history.entity;
    history.event = data.event || history.event;
    history.sentence = data.sentence || history.sentence;
    history.record = data.record || history.record;
    history.user = data.user || history.user;
    await history.save();

    return history;
  }

  async deleteItem(history: HistoryDoc) {
    const deleted = await History.findByIdAndDelete(history.id);

    return deleted;
  }
}
