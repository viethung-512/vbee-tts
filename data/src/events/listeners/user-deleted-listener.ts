import { Message } from 'node-nats-streaming';
import { Listener, Subjects, UserDeletedEvent } from '@tts-dev/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';

export class UserDeletedListener extends Listener<UserDeletedEvent> {
  subject: Subjects.USER_DELETED = Subjects.USER_DELETED;
  queueGroupName = queueGroupName;

  async onMessage(data: UserDeletedEvent['data'], msg: Message) {
    console.log('UserDeletedListener received data');
    const { ids } = data;
    await User.deleteMany({ _id: { $in: ids } });

    msg.ack();
  }
}
