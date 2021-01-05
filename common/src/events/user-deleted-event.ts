import { Subjects } from './subjects';

export interface UserDeletedEvent {
  subject: Subjects.USER_DELETED;
  data: {
    ids: string[];
  };
}
