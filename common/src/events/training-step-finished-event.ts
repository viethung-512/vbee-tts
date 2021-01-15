import { Subjects } from './subjects';

export interface TrainingStepFinished {
  subject: Subjects.TRAINING_STEP_FINISHED;
  data: {
    prevUID: number;
    training_id: string;
    url: string;
    status: 'success' | 'error';
    errorMessage?: string;
  };
}
