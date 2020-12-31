import axiosClient from './axiosClient';
import { Record as SentenceRecord } from 'app/types/record';
import { PaginateQuery, PaginateResponse, SentenceType } from '@tts-dev/common';
import { User } from 'app/types/user';

interface SubmitRecordData {
  original: string;
}

const importRecords = async (shareLink: string): Promise<SentenceRecord[]> => {
  return axiosClient.post('/api/records/import', {
    shareLink: shareLink,
  });
};

const getRecords = async (
  query: PaginateQuery,
  filters?: any[]
): Promise<PaginateResponse> => {
  let filtersObject: Record<string, any> = {};
  if (filters) {
    for (const filter of filters) {
      filtersObject[filter.field] = filter.data;
    }
  }

  return axiosClient.get('/api/records', {
    params: { ...query, ...filtersObject },
  });
};

const getRecord = async (id: string): Promise<SentenceRecord> => {
  return axiosClient.get(`/api/records/${id}`);
};

const getFirstRecord = async (): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/records/first-record`);
};

const getLastRecord = async (): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/records/last-record`);
};

const getNextRecord = async (id: string): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/records/${id}/next-record`);
};

const getPreviousRecord = async (
  id: string
): Promise<{ data: string | null }> => {
  return axiosClient.get(`/api/records/${id}/previous-record`);
};

const submitRecord = async (
  id: string,
  data: SubmitRecordData
): Promise<SentenceRecord> => {
  return axiosClient.put(`/api/records/submit/${id}`, { ...data });
};

const submitErrorRecord = async (
  id: string,
  errorMessage: string
): Promise<SentenceRecord> => {
  return axiosClient.put(`/api/records/submit-error/${id}`, { errorMessage });
};

const assignRecords = async (args: {
  checker: User;
  count?: number;
  type?: SentenceType;
  ids?: string[];
}): Promise<SentenceRecord[]> => {
  return axiosClient.put('/api/records/assign', { ...args });
};

const approveRecords = async (ids: string[]): Promise<SentenceRecord[]> => {
  return axiosClient.put('/api/records/approve', { ids });
};

const deleteRecords = async (ids: string[]): Promise<SentenceRecord[]> => {
  return axiosClient.delete('/api/records', {
    data: { ids },
  });
};

const recordAPI = {
  importRecords,
  getRecords,
  getRecord,
  getFirstRecord,
  getLastRecord,
  getNextRecord,
  getPreviousRecord,
  submitRecord,
  submitErrorRecord,
  assignRecords,
  approveRecords,
  deleteRecords,
};

export default recordAPI;
