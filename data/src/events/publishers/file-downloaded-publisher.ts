import { Publisher, FileDownloadedEvent, Subjects } from '@tts-dev/common';

export class FileDownloadedPublisher extends Publisher<FileDownloadedEvent> {
  subject: Subjects.FILE_DOWNLOADED = Subjects.FILE_DOWNLOADED;
}
