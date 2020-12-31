import { Publisher, Subjects, UserUpdatedEvent } from '@tts-dev/common';

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: Subjects.USER_UPDATED = Subjects.USER_UPDATED;
}
