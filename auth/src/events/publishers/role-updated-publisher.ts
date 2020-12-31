import { Publisher, Subjects, RoleUpdatedEvent } from '@tts-dev/common';

export class RoleUpdatedPublisher extends Publisher<RoleUpdatedEvent> {
  subject: Subjects.ROLE_UPDATED = Subjects.ROLE_UPDATED;
}
