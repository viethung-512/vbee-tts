import axios from 'axios';
import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TrainingStepFinished } from '@tts-dev/common';
import { queueGroupName } from './queue-group-name';
import { TrainingProgressDao } from '../../daos/training-progress-dao';
import { TrainingParadigmDao } from '../../daos/training-paradigm-dao';

export class TrainingStepFinishedListener extends Listener<TrainingStepFinished> {
  subject: Subjects.TRAINING_STEP_FINISHED = Subjects.TRAINING_STEP_FINISHED;
  queueGroupName = queueGroupName;

  async onMessage(data: TrainingStepFinished['data'], msg: Message) {
    console.log('TrainingStepFinishedListener received data');
    const trainingProgressDao = new TrainingProgressDao();
    const trainingParadigmDao = new TrainingParadigmDao();
    const { prevUID, training_id, url, status, errorMessage } = data;

    if (status === 'success') {
      const trainingProgress = await trainingProgressDao.findItem({
        training_id,
      });
      if (trainingProgress) {
        const trainingParadigm = await trainingParadigmDao.findItem(
          trainingProgress.paradigm.id
        );
        if (trainingParadigm) {
          if (prevUID === trainingParadigm.steps.length) {
            // @ts-ignore
            TRAINING_RUNNING = false;
            await trainingParadigmDao.updateItem(trainingParadigm, {
              status: 'inactive',
            });
          } else {
            const nextStep = trainingParadigm.steps.find(
              st => st.uid === prevUID + 1
            );
            console.log({ currentStep: prevUID, nextStep });
            if (nextStep) {
              console.log('Next step: ', nextStep);
              await axios.post(nextStep.step.url, {
                training_id,
                voice: 'hn_female_test',
                corpora: ['book', 'news'],
              });
            }
          }
        }
      }
    } else {
      console.log({ status, errorMessage });
    }

    msg.ack();
  }
}
