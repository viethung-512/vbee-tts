import { DialectType, SentenceStatus, SentenceType } from '@tts-dev/common';
import { Sentence } from './sentence';
import { User } from './user';
import { Voice } from './voice';

export interface Record {
  id: string;
  uid: number;
  original: string;
  type: SentenceType;
  status: SentenceStatus;
  sentence: Sentence;
  voice: Voice;
  dialect: DialectType;
  audioURL?: string | null;
  allophoneContent?: string;
  checker?: User;
  errorMessage?: string;
}
