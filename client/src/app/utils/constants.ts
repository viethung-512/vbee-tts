import { minPassword } from './config';

const rootUser = { name: 'ROOT' };
const resources = {
  USER: 'USER',
  ROLE: 'ROLE',
  SENTENCE: 'SENTENCE',
  RECORD: 'RECORD',
};
const actions = {
  CREATE: 'CREATE',
  READ: 'READ',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};
export const roleConstants = { rootUser, resources, actions };

export const sentenceStatus = {
  STATUS_INITIAL: 'INITIAL',
  STATUS_ASSIGNED: 'ASSIGNED',
  STATUS_SUBMITTED: 'SUBMITTED',
  STATUS_ERROR: 'ERROR',
  STATUS_APPROVED: 'APPROVED',
};

export const sentenceTypes = {
  TYPE_BOOK: 'BOOK',
  TYPE_CALL_CENTER: 'CALL_CENTER',
  TYPE_DIALOG: 'DIALOG',
  TYPE_NEWS: 'NEWS',
  TYPE_STORY: 'STORY',
  TYPE_DIALOG_2: 'DIALOG_2',
};

export const recordStatus = {
  STATUS_INITIAL: 'INITIAL',
  STATUS_ASSIGNED: 'ASSIGNED',
  STATUS_SUBMITTED: 'SUBMITTED',
  STATUS_ERROR: 'ERROR',
  STATUS_APPROVED: 'APPROVED',
};

export const recordTypes = {
  TYPE_BOOK: 'BOOK',
  TYPE_CALL_CENTER: 'CALL_CENTER',
  TYPE_DIALOG: 'DIALOG',
  TYPE_NEWS: 'NEWS',
  TYPE_STORY: 'STORY',
  TYPE_DIALOG_2: 'DIALOG_2',
};

export const validatorMessages = {
  REQUIRED_EXISTS: 'Must not be empty.',
  REQUIRED_VALID_EMAIL: 'Must be a valid email address.',
  REQUIRED_VALID_PHONE_NUMBER: 'Must be a valid phone number.',
  REQUIRED_MATCH_PASSWORD: 'Password must matches.',
  REQUIRED_PASSWORD_MIN: `Password must at least ${minPassword} characters.`,
};

export const dialects = {
  HANOI: 'HN',
  SAIGON: 'SG',
};

export const historyEvents = {
  EVENT_INSERT: 'INSERT',
  EVENT_UPDATE: 'UPDATE',
  EVENT_DELETE: 'DELETE',
  EVENT_ASSIGN: 'ASSIGN',
  EVENT_SUBMIT: 'SUBMIT',
  EVENT_ERROR: 'ERROR',
  EVENT_APPROVE: 'APPROVE',
};

export const historyEntities = {
  ENTITY_SENTENCE: 'SENTENCE',
  ENTITY_RECORD: 'RECORD',
};

export const modalActionTypes = {
  DELETE_USER: 'DELETE_USER',
  DELETE_ROLE: 'DELETE_ROLE',
  APPROVE_ROLE: 'APPROVE_ROLE',
  DELETE_SENTENCE: 'DELETE_SENTENCE',
  APPROVE_SENTENCE: 'APPROVE_SENTENCE',
  IMPORT_SENTENCE: 'IMPORT_SENTENCE',
  IMPORT_RECORD: 'IMPORT_RECORD',
  APPROVE_RECORD: 'APPROVE_RECORD',
  DELETE_RECORD: 'DELETE_RECORD',
  DELETE_BROADCASTER: 'DELETE_BROADCASTER',
  DELETE_VOICE: 'DELETE_VOICE',
};

export const voices = [
  'voice-vbee-tts-voice-hn_male_manhdung_news_48k-h',
  'vbee-tts-voice-sg_male_minhhoang_news_48k-h',
];
