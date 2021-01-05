import { Action } from '../types/action';
import { Resource } from '../types/resource';
import { Subjects } from './subjects';

export interface UserUpdatedEvent {
  subject: Subjects.USER_UPDATED;
  data: {
    id: string;
    username: string;
    email: string;
    phoneNumber: string;
    role: {
      id: string;
      name: string;
      resources: {
        name: Resource;
        actions: Action[];
      }[];
      policy: string | null;
    };
    photoURL?: string;
  };
}
