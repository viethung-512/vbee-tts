import axiosClient from './axiosClient';

export interface Progress {
  training_id: string;
  container: string;
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

const getTrainingProgress = async (): Promise<{
  progresses: (Progress | null)[];
}> => {
  return axiosClient.get('/api/training/progress');
};

const training = async (): Promise<string> => {
  return axiosClient.post('/api/training', {
    voice: 'hn_female_test',
    corpora: ['book', 'news'],
  });
};

const trainingAPI = {
  getTrainingProgress,
  training,
};

export default trainingAPI;
