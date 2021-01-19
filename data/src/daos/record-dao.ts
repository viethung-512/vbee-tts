import { BaseDao } from '@tts-dev/common';
import { Record, RecordAttrs, RecordDoc, RecordModel } from '../models/record';

export class RecordDao extends BaseDao<RecordDoc, RecordModel, RecordAttrs> {
  model = Record;
  populate = ['checker', 'sentence'];

  async createItem(data: RecordAttrs) {
    const record = await Record.build({
      uid: data.uid,
      original: data.original,
      type: data.type,
      status: data.status,
      sentence: data.sentence,
      voice: data.voice,
      dialect: data.dialect,
      audioURL: data.audioURL,
      pronunciation: data.pronunciation,
      allophoneContent: data.allophoneContent,
      checker: data.checker,
      errorMessage: data.errorMessage,
    });
    await record.save();

    const newSentence = await Record.findById(record.id).populate(
      this.populate
    );

    return newSentence!;
  }

  async updateItem(record: RecordDoc, data: Partial<RecordAttrs>) {
    record.original = data.original || record.original;
    record.type = data.type || record.type;
    record.status = data.status || record.status;
    record.sentence = data.sentence || record.sentence;
    record.voice = data.voice || record.voice;
    record.dialect = data.dialect || record.dialect;
    record.audioURL = data.audioURL || record.audioURL;
    record.pronunciation = data.pronunciation || record.pronunciation;
    record.allophoneContent = data.allophoneContent || record.allophoneContent;
    record.checker = data.checker || record.checker;
    record.errorMessage = data.errorMessage || record.errorMessage;

    await record.save();

    return record;
  }

  async deleteItem(record: RecordDoc) {
    const deleted = await Record.findByIdAndDelete(record.id);

    return deleted;
  }
}
