import { DialectType, SentenceStatus, SentenceType } from '@tts-dev/common';
import { User } from './user';

export interface Sentence {
  id: string;
  uid: number;
  original: string;
  type: SentenceType;
  status: SentenceStatus;
  dialects: {
    name: DialectType;
    pronunciation: string;
    image?: string;
    originalImage?: string;
  }[];
  checker?: User;
  errorMessage?: string;
}
