import { Publisher, SentenceSubmittedEvent, Subjects } from '@tts-dev/common';

export class SentenceSubmittedPublisher extends Publisher<SentenceSubmittedEvent> {
  subject: Subjects.SENTENCE_SUBMITTED = Subjects.SENTENCE_SUBMITTED;
}
