import axiosClient from './axiosClient';
import { PaginateQuery, PaginateResponse, SentenceType } from '@tts-dev/common';
import { Sentence } from 'app/types/sentence';
import { User } from 'app/types/user';

interface SubmitSentenceData {
  original?: string;
  dialectHN?: string;
  dialectSG?: string;
}

const importSentences = async (file: any): Promise<Sentence[]> => {
  const formData = new FormData();

  formData.append('file', file);

  return axiosClient.post('/api/sentences/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getSampleImportFileURL = async (): Promise<string> => {
  return axiosClient.get('/api/sentences/import-sample-file');
};

const getSentences = async (
  query: PaginateQuery,
  filters?: any[]
): Promise<PaginateResponse> => {
  let filtersObject: Record<string, any> = {};
  if (filters) {
    for (const filter of filters) {
      filtersObject[filter.field] = filter.data;
    }
  }

  return axiosClient.get('/api/sentences', {
    params: { ...query, ...filtersObject },
  });
};

const getSentence = async (id: string): Promise<Sentence> => {
  return axiosClient.get(`/api/sentences/${id}`);
};

const getFirstSentence = async (): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/sentences/first-sentence`);
};
const getLastSentence = async (): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/sentences/last-sentence`);
};
const getNextSentence = async (
  id: string
): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/sentences/${id}/next-sentence`);
};
const getPreviousSentence = async (
  id: string
): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/sentences/${id}/previous-sentence`);
};

const submitSentence = async (
  id: string,
  data: SubmitSentenceData
): Promise<Sentence> => {
  return axiosClient.put(`/api/sentences/submit/${id}`, {
    ...data,
  });
};

const submitErrorSentence = async (
  id: string,
  errorMessage: string
): Promise<Sentence> => {
  return axiosClient.put(`/api/sentences/submit-error/${id}`, { errorMessage });
};

const approveSentences = async (ids: string[]): Promise<Sentence[]> => {
  return axiosClient.put('/api/sentences/approve', { ids });
};

const assignSentences = async (args: {
  checker: User;
  count?: number;
  type?: SentenceType;
  ids?: string[];
}): Promise<Sentence[]> => {
  return axiosClient.put('/api/sentences/assign', { ...args });
};

const deleteSentences = async (ids: string[]): Promise<Sentence> => {
  return axiosClient.delete('/api/sentences', {
    data: { ids },
  });
};

const sentenceAPI = {
  getSampleImportFileURL,
  getSentences,
  getSentence,
  getFirstSentence,
  getLastSentence,
  getNextSentence,
  getPreviousSentence,
  importSentences,
  submitSentence,
  submitErrorSentence,
  approveSentences,
  assignSentences,
  deleteSentences,
};

export default sentenceAPI;
