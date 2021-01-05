import { Subjects } from './subjects';

export interface FileDownloadedEvent {
  subject: Subjects.FILE_DOWNLOADED;
  data: {
    total: number;
    current: number;
    percent: number;
  };
}
