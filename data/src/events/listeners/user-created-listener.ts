import { Message } from 'node-nats-streaming';
import { Listener, Subjects, UserCreatedEvent } from '@tts-dev/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.USER_CREATED = Subjects.USER_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    console.log('UserCreatedListener received data');
    const { id, username, email, phoneNumber, role } = data;

    const user = User.build({
      id: id,
      username: username,
      email: email,
      phoneNumber: phoneNumber,
      role: role,
    });
    await user.save();

    msg.ack();
  }
}
