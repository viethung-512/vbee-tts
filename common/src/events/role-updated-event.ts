import { Action } from '../types/action';
import { Resource } from '../types/resource';
import { Subjects } from './subjects';

export interface RoleUpdatedEvent {
  subject: Subjects.ROLE_UPDATED;
  data: {
    id: string;
    name: string;
    resources: {
      name: Resource;
      actions: Action[];
    }[];
    policy: string | null;
  };
}
