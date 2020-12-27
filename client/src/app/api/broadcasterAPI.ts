import {
  DialectType,
  PaginateQuery,
  PaginateResponse,
  SentenceType,
} from '@tts-dev/common';
import { Broadcaster, BroadcasterSentence } from 'app/types/broadcaster';
import axiosClient from './axiosClient';
import { Sentence } from 'app/types/sentence';
import { Record } from 'app/types/record';

interface GetBroadcasterResponse extends PaginateResponse {
  docs: Broadcaster[];
}

interface GetBroadcasterSentencesResponse extends PaginateResponse {
  docs: Sentence[];
}

const getBroadcasters = async (
  query: PaginateQuery
): Promise<GetBroadcasterResponse> => {
  return axiosClient.get('/api/broadcasters', { params: query });
};

const getBroadcaster = async (id: string): Promise<Broadcaster> => {
  return axiosClient.get(`/api/broadcasters/${id}`);
};

const createBroadcaster = async (
  data: Omit<Broadcaster, 'id'>
): Promise<Broadcaster> => {
  return axiosClient.post('/api/broadcasters', {
    ...data,
  });
};

const updateBroadcaster = async (
  id: string,
  data: Partial<Omit<Broadcaster, 'id'>>
): Promise<Broadcaster> => {
  return axiosClient.put(`/api/broadcasters/${id}`, {
    ...data,
  });
};

const deleteBroadcasters = async (ids: string[]): Promise<Broadcaster> => {
  return axiosClient.delete('/api/broadcasters', {
    data: { ids },
  });
};

const getBroadcasterSentences = async (
  query: PaginateQuery
): Promise<Sentence[]> => {
  return axiosClient.get('/api/broadcasters/broadcaster-sentences', {
    params: query,
  });
};

const getBroadcasterSentence = async (
  id: string,
  dialect: DialectType
): Promise<BroadcasterSentence> => {
  return axiosClient.get(`/api/broadcasters/broadcaster-sentences/${id}`, {
    params: { dialect },
  });
};

const getBroadcasterSentenceInit = async (
  type: SentenceType,
  dialect: DialectType
): Promise<{ data: string }> => {
  return axiosClient.get('/api/broadcasters/broadcaster-sentences-init', {
    params: { type, dialect },
  });
};

const getFirst = async (): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/broadcasters/first-sentence`);
};
const getLast = async (): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/broadcasters/last-sentence`);
};
const getNext = async (id: string): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/broadcasters/${id}/next-sentence`);
};
const getPrevious = async (id: string): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/broadcasters/${id}/previous-sentence`);
};

const toggleFinishRecord = async (
  id: string,
  dialect: DialectType
): Promise<BroadcasterSentence> => {
  return axiosClient.put(`/api/broadcasters/toggle-finish-record/${id}`, {
    dialect: dialect,
  });
};

const submitErrorBroadcasterSentence = async (
  uid: number,
  errorMessage: string
): Promise<Record> => {
  return axiosClient.put(`/api/broadcasters/submit-error/${uid}`, {
    errorMessage,
  });
};

const broadcasterAPI = {
  getBroadcasters,
  getBroadcaster,
  createBroadcaster,
  updateBroadcaster,
  deleteBroadcasters,
  getBroadcasterSentences,
  getBroadcasterSentence,
  getBroadcasterSentenceInit,
  getFirst,
  getLast,
  getNext,
  getPrevious,
  toggleFinishRecord,
  submitErrorBroadcasterSentence,
};

export default broadcasterAPI;
