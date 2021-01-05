import { Action } from '../types/action';
import { Resource } from '../types/resource';
import { Subjects } from './subjects';

export interface UserCreatedEvent {
  subject: Subjects.USER_CREATED;
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
  };
}
