import { Message } from 'node-nats-streaming';
import {
  Listener,
  NotFoundError,
  Subjects,
  UserUpdatedEvent,
} from '@tts-dev/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.USER_UPDATED = Subjects.USER_UPDATED;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent['data'], msg: Message) {
    console.log('UserUpdatedListener received data');
    const { id, username, email, phoneNumber, role, photoURL } = data;
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.username = username;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.role = role;
    user.photoURL = photoURL;
    await user.save();

    msg.ack();
  }
}
