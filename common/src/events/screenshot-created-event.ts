import { Subjects } from './subjects';
import { DialectType } from '../types/dialect';

export interface ScreenshotCreatedEvent {
  subject: Subjects.SCREENSHOT_CREATED;
  data: {
    userId: string;
    sentenceId: string;
    dialectId: DialectType;
    dialectScreenshotURL: string;
    originalScreenshotURL?: string;
  };
}
