import { Subjects } from './subjects';
import { DialectType } from '../types/dialect';

export interface SentenceSubmittedEvent {
  subject: Subjects.SENTENCE_SUBMITTED;
  data: {
    userId: string;
    sentenceId: string;
    pronunciation: string;
    dialectId: DialectType;
    sentenceOriginal?: string;
  };
}
