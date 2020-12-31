import { BaseDao } from '@tts-dev/common';
import {
  SentenceAttrs,
  SentenceDoc,
  SentenceModel,
  Sentence,
} from '../models/sentence';

export class SentenceDao extends BaseDao<
  SentenceDoc,
  SentenceModel,
  SentenceAttrs
> {
  model = Sentence;
  populate = ['checker'];

  async createItem(data: SentenceAttrs) {
    const sentence = await Sentence.build({
      manual_uid: data.manual_uid,
      raw: data.raw,
      original: data.raw,
      type: data.type,
      status: data.status,
      checker: data.checker,
      dialects: data.dialects,
    });
    await sentence.save();

    const newSentence = await Sentence.findById(sentence.id).populate(
      this.populate
    );

    return newSentence!;
  }

  async updateItem(sentence: SentenceDoc, data: Partial<SentenceAttrs>) {
    sentence.original = data.original || sentence.original;
    sentence.type = data.type || sentence.type;
    sentence.status = data.status || sentence.status;
    sentence.checker = data.checker || sentence.checker;
    sentence.dialects = data.dialects || sentence.dialects;
    sentence.errorMessage = data.errorMessage || sentence.errorMessage;

    await sentence.save();

    return sentence;
  }

  async deleteItem(sentence: SentenceDoc) {
    const deleted = await Sentence.findByIdAndDelete(sentence.id);

    return deleted;
  }
}
