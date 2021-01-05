import { Resource } from '../types/resource';
import { Action } from '../types/action';

export const rootRole = {
  name: 'ROOT',
  resources: Object.values(Resource).map(rs => {
    return {
      name: rs,
      actions: Object.values(Action),
    };
  }),
};
