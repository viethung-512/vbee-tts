import axiosClient from './axiosClient';
import { DialectType } from '@tts-dev/common';

const searchAllophone = async (
  text: string,
  dialect: DialectType
): Promise<{
  pronunciation: string;
  allophoneContent: string;
}> => {
  return axiosClient.get('/api/allophone', {
    params: {
      text,
      dialect,
    },
  });
};

const allophoneAPI = {
  searchAllophone,
};

export default allophoneAPI;
