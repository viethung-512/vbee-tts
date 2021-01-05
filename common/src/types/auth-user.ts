import { Resource } from './resource';
import { Action } from './action';

export interface AuthUser {
  id: string;
  role: {
    name: string;
    resources: {
      name: Resource;
      actions: Action[];
    }[];
  };
}
