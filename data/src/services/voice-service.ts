import {
  PaginateQuery,
  PaginateResponse,
  ServiceResponse,
} from '@tts-dev/common';

import { VoiceDao } from '../daos/voice-dao';
import { VoiceDoc } from '../models/voice';

interface PaginatedVoice extends PaginateResponse {
  docs: VoiceDoc[];
}

interface GetUsersResponse extends ServiceResponse {
  paginatedVoices?: PaginatedVoice;
}

const getVoices = async (query: PaginateQuery): Promise<GetUsersResponse> => {
  const voiceDao = new VoiceDao();
  const paginated = await voiceDao.findAll({ paginateQuery: query });

  return {
    success: true,
    paginatedVoices: paginated,
  };
};

const voiceService = { getVoices };

export { voiceService };
