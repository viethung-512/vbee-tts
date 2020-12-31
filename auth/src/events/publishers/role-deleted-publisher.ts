import { Publisher, Subjects, RoleDeletedEvent } from '@tts-dev/common';

export class RoleDeletedPublisher extends Publisher<RoleDeletedEvent> {
  subject: Subjects.ROLE_DELETED = Subjects.ROLE_DELETED;
}
