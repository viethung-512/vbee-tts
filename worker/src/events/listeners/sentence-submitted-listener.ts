import { Message } from 'node-nats-streaming';

import { Listener, Subjects, SentenceSubmittedEvent } from '@tts-dev/common';
import { queueGroupName } from './queue-group-name';
import { screenshotQueue } from '../../queues/screenshot-queue';

export class SentenceSubmittedListener extends Listener<SentenceSubmittedEvent> {
  subject: Subjects.SENTENCE_SUBMITTED = Subjects.SENTENCE_SUBMITTED;
  queueGroupName = queueGroupName;

  async onMessage(data: SentenceSubmittedEvent['data'], msg: Message) {
    console.log('SentenceSubmittedListener received data');
    console.log(data);
    await screenshotQueue.add({
      userId: data.userId,
      sentenceId: data.sentenceId,
      sentenceOriginal: data.sentenceOriginal,
      pronunciation: data.pronunciation,
      dialectId: data.dialectId,
    });

    msg.ack();
  }
}
