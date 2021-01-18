import { Publisher, Subjects, TrainingStepFinished } from '@tts-dev/common';

export class TrainingStepFinishedPublisher extends Publisher<TrainingStepFinished> {
  subject: Subjects.TRAINING_STEP_FINISHED = Subjects.TRAINING_STEP_FINISHED;
}
