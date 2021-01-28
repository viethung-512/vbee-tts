import axios from 'axios';
import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TrainingStepFinished } from '@tts-dev/common';
import { queueGroupName } from './queue-group-name';
// import { TrainingParadigmDao } from '../../daos/training-paradigm-dao';
import { TrainingProgressDao } from './../../daos/training-progress-dao';
import { ModelTrainDao } from './../../daos/model-train-dao';
import { getEnv } from '../../configs/env-config';

export class TrainingStepFinishedListener extends Listener<TrainingStepFinished> {
  subject: Subjects.TRAINING_STEP_FINISHED = Subjects.TRAINING_STEP_FINISHED;
  queueGroupName = queueGroupName;

  async onMessage(data: TrainingStepFinished['data'], msg: Message) {
    const { training } = getEnv();
    console.log('TrainingStepFinishedListener received data: ', data);

    /** START_NEW_CODE */
    const trainingProgressDao = new TrainingProgressDao();
    const modelTrainDao = new ModelTrainDao();
    const { prevUID, training_id, status, errorMessage } = data;

    const modelTrain = await modelTrainDao.findItem({
      curr_training_id: training_id,
    });
    const curTrainingProgress = await trainingProgressDao.findItem({
      training_id,
    });

    if (!modelTrain || !curTrainingProgress) {
      console.log('Can not found modelTrain or curTrainingProgress');
      console.log({ modelTrain, curTrainingProgress });
    } else {
      if (status === 'success') {
        if (prevUID === modelTrain.steps.length) {
          await trainingProgressDao.updateItem(curTrainingProgress, {
            status: 'completed',
          });
          console.log('training progresses updated');
          await modelTrainDao.updateItem(modelTrain, {
            curr_training_id: null,
          });

          // @ts-ignore
          TRAINING_RUNNING = false;
        } else {
          const nextStep = modelTrain.steps.find(
            st => st.index === prevUID + 1
          );
          console.log({ currentStep: prevUID, nextStep });
          if (nextStep) {
            console.log('Next step: ', nextStep);
            await axios.post(`${training.uri}/${nextStep.url}`, {
              training_id: training_id,
              ...curTrainingProgress.progress_args.required_args,
              ...curTrainingProgress.progress_args.optional_args[
                nextStep.index
              ],
            });
          }
        }
      } else {
        await trainingProgressDao.updateItem(curTrainingProgress, {
          status: 'error',
          errorMessage: errorMessage,
        });
        console.log('training progresses updated');
        await modelTrainDao.updateItem(modelTrain, { curr_training_id: null });
        // @ts-ignore
        TRAINING_RUNNING = false;
      }
    }

    msg.ack();
    /** END_NEW_CODE */

    // const trainingParadigmDao = new TrainingParadigmDao();
    // const { prevUID, training_id, status, errorMessage } = data;

    // if (status === 'success') {
    //   const trainingParadigm = await trainingParadigmDao.findItem({
    //     curr_training_id: training_id,
    //   });
    //   if (trainingParadigm) {
    //     if (prevUID === trainingParadigm.steps.length) {
    //       // @ts-ignore
    //       TRAINING_RUNNING = false;
    //       await trainingParadigmDao.updateItem(trainingParadigm, {
    //         status: 'inactive',
    //         curr_training_id: null,
    //       });
    //     } else {
    //       const nextStep = trainingParadigm.steps.find(
    //         st => st.uid === prevUID + 1
    //       );
    //       console.log({ currentStep: prevUID, nextStep });
    //       if (nextStep) {
    //         console.log('Next step: ', nextStep);
    //         await axios.post(nextStep.step.url, {
    //           training_id,
    //           voice: 'hn_female_test',
    //           corpora: ['book', 'news'],
    //           // corpora: ['book'],
    //         });
    //       }
    //     }
    //   }
    // } else if (status === 'error') {
    //   console.log({ training_id });
    //   const trainingParadigm = await trainingParadigmDao.findItem({
    //     curr_training_id: training_id,
    //   });

    //   console.log('need update', trainingParadigm);
    //   if (trainingParadigm) {
    //     // @ts-ignore
    //     TRAINING_RUNNING = false;
    //     await trainingParadigmDao.updateItem(trainingParadigm, {
    //       status: 'inactive',
    //       curr_training_id: '',
    //     });

    //     console.log('updated');
    //   }
    // } else {
    //   console.log({ status, errorMessage });
    // }

    // msg.ack();
  }
}
