import { Publisher, Subjects, UserCreatedEvent } from '@tts-dev/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.USER_CREATED = Subjects.USER_CREATED;
}
