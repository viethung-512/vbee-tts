import { Subjects } from './subjects';

export interface GGDriverInitializedEvent {
  subject: Subjects.GG_DRIVER_INITIALIZED;
  data: {
    initialized: boolean;
  };
}
