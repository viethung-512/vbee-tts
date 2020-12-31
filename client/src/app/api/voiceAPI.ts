import axiosClient from './axiosClient';

import { PaginateQuery, PaginateResponse } from '@tts-dev/common';
import { Voice } from 'app/types/voice';

interface GetVoicesResponse extends PaginateResponse {
  docs: Voice[];
}

const getVoices = async (query: PaginateQuery): Promise<GetVoicesResponse> => {
  return axiosClient.get('/api/voices', {
    params: query,
  });
};

const voiceAPI = { getVoices };

export default voiceAPI;
