import { DialectType, SentenceType } from '@tts-dev/common';
import { User } from './user';
import { Voice } from './voice';

export interface Broadcaster {
  id: string;
  types: SentenceType[];
  completed: string[];
  user: User;
  voice: Voice;
  dialect: DialectType;
  expiredAt: string;
  progresses: {
    type: SentenceType;
    total: number;
    current: number;
    percent: number;
  }[];
}

export interface BroadcasterSentence {
  id: string;
  uid: number;
  type: SentenceType;
  dialect: DialectType;
  completed: boolean;
  original: string;
  pronunciation: string;
  originalImage?: string;
  dialectImage?: string;
}
