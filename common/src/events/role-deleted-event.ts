import { Subjects } from './subjects';

export interface RoleDeletedEvent {
  subject: Subjects.ROLE_DELETED;
  data: {
    ids: string[];
  };
}
