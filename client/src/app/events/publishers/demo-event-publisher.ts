import { Publisher, Subjects, DemoEvent } from '@tts-dev/common';

export class DemoEventPublisher extends Publisher<DemoEvent> {
  subject: Subjects.DEMO_SUBJECT = Subjects.DEMO_SUBJECT;
}
