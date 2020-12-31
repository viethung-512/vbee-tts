import { Publisher, Subjects, UserDeletedEvent } from '@tts-dev/common';

export class UserDeletedPublisher extends Publisher<UserDeletedEvent> {
  subject: Subjects.USER_DELETED = Subjects.USER_DELETED;
}
