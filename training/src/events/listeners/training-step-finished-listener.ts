import axios from 'axios';
import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TrainingStepFinished } from '@tts-dev/common';
import { queueGroupName } from './queue-group-name';
import { TrainingParadigmDao } from '../../daos/training-paradigm-dao';

export class TrainingStepFinishedListener extends Listener<TrainingStepFinished> {
  subject: Subjects.TRAINING_STEP_FINISHED = Subjects.TRAINING_STEP_FINISHED;
  queueGroupName = queueGroupName;

  async onMessage(data: TrainingStepFinished['data'], msg: Message) {
    console.log('TrainingStepFinishedListener received data');
    const trainingParadigmDao = new TrainingParadigmDao();
    const { prevUID, training_id, url, status, errorMessage } = data;

    if (status === 'success') {
      const trainingParadigm = await trainingParadigmDao.findItem({
        curr_training_id: training_id,
      });
      if (trainingParadigm) {
        if (prevUID === trainingParadigm.steps.length) {
          // @ts-ignore
          TRAINING_RUNNING = false;
          await trainingParadigmDao.updateItem(trainingParadigm, {
            status: 'inactive',
            curr_training_id: null,
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
              // corpora: ['book'],
            });
          }
        }
      }
    } else if (status === 'error') {
      console.log({ training_id });
      const trainingParadigm = await trainingParadigmDao.findItem({
        curr_training_id: training_id,
      });

      console.log('need update', trainingParadigm);
      if (trainingParadigm) {
        // @ts-ignore
        TRAINING_RUNNING = false;
        await trainingParadigmDao.updateItem(trainingParadigm, {
          status: 'inactive',
          curr_training_id: '',
        });

        console.log('updated');
      }
    } else {
      console.log({ status, errorMessage });
    }

    msg.ack();
  }
}
