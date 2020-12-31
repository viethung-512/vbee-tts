import { BaseDao } from '@tts-dev/common';
import { Voice, VoiceAttrs, VoiceDoc, VoiceModel } from '../models/voice';

export class VoiceDao extends BaseDao<VoiceDoc, VoiceModel, VoiceAttrs> {
  model = Voice;
  populate = [];

  async createItem(data: VoiceAttrs) {
    const voice = Voice.build({
      name: data.name,
      code: data.code,
    });
    await voice.save();

    return voice;
  }

  async updateItem(voice: VoiceDoc, data: Partial<VoiceAttrs>) {
    voice.name = data.name || voice.name;
    voice.code = data.code || voice.code;
    await voice.save();

    return voice;
  }

  async deleteItem(voice: VoiceDoc) {
    const deleted = await Voice.findByIdAndDelete(voice.id);

    return deleted;
  }
}
