import { Subjects } from './subjects';

export interface DemoEvent {
  subject: Subjects.DEMO_SUBJECT;
  data: {
    demo: string;
  };
}
