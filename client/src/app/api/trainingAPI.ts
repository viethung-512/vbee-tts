import { PaginateQuery, PaginateResponse } from '@tts-dev/common';
import axiosClient from './axiosClient';

// export interface Progress {
//   training_id: string;
//   container: string;
//   start_time: string;
//   name: string;
//   total: number;
//   current: number;
//   percent: number;
//   status: boolean;
//   steps: {
//     name: string;
//     total: number;
//     current: number;
//     percent: number;
//   }[];
// }

export interface Progress {
  status: 'processing' | 'success' | 'error';
  training_id: string;
  container: string;
  stepUID: number;
  start_time: string;
  name: string;
  total: number;
  current: number;
  percent: number;
  steps: {
    name: string;
    total: number;
    current: number;
    percent: number;
  }[];
}

const getTrainingProgress = async (
  id: string
): Promise<{
  progresses: (Progress | null)[];
}> => {
  return axiosClient.get(`/api/training/progress/${id}`);
};

const training = async (
  paradigm: string,
  voice: string,
  corpora: string[]
): Promise<string> => {
  return axiosClient.post(`/api/training/${paradigm}`, {
    voice,
    corpora,
  });
};

const checkCurrTraining = async (): Promise<{
  isTraining: boolean;
  currTrainingId: string | null;
}> => {
  return axiosClient.get('/api/training/isTraining');
};

const getTrainingParadigms = async (
  query: PaginateQuery
): Promise<PaginateResponse> => {
  return axiosClient.get('/api/training/paradigms', {
    params: query,
  });
};

const trainingAPI = {
  getTrainingProgress,
  training,
  checkCurrTraining,
  getTrainingParadigms,
};

export default trainingAPI;
