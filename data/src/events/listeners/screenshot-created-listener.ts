import { Message } from 'node-nats-streaming';
import {
  HistoryEntity,
  HistoryEvent,
  Listener,
  ScreenshotCreatedEvent,
  Subjects,
} from '@tts-dev/common';

import { queueGroupName } from './queue-group-name';
import { SentenceDao } from '../../daos/sentence-dao';
import { HistoryDao } from '../../daos/history-dao';
import { UserDao } from '../../daos/user-dao';

export class ScreenshotCreatedListener extends Listener<ScreenshotCreatedEvent> {
  subject: Subjects.SCREENSHOT_CREATED = Subjects.SCREENSHOT_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: ScreenshotCreatedEvent['data'], msg: Message) {
    console.log('ScreenshotCreatedListener received data');
    const sentenceDao = new SentenceDao();
    const historyDao = new HistoryDao();
    const userDao = new UserDao();

    const {
      userId,
      sentenceId,
      dialectId,
      originalScreenshotURL,
      dialectScreenshotURL,
    } = data;

    const sentence = await sentenceDao.findItem(sentenceId);
    const user = await userDao.findItem(userId);
    if (!sentence || !user) {
      throw new Error(
        'Error while listen screenshot:created event: sentence or user not found'
      );
    }

    const newDialects = sentence.dialects.map(d => {
      if (d.name === dialectId) {
        return {
          name: d.name,
          pronunciation: d.pronunciation,
          image: dialectScreenshotURL,
          originalImage: originalScreenshotURL,
        };
      }

      return {
        name: d.name,
        pronunciation: d.pronunciation,
        image: d.image,
        originalImage: d.originalImage,
      };
    });

    await sentenceDao.updateItem(sentence, {
      dialects: newDialects,
    });

    console.log({ sentence });

    await historyDao.createItem({
      event: HistoryEvent.UPDATE,
      entity: HistoryEntity.SENTENCE,
      user: user,
      sentence: sentence,
    });

    msg.ack();
  }
}
