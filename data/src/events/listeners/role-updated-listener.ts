import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  UserCreatedEvent,
  RoleUpdatedEvent,
} from '@tts-dev/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';

export class RoleUpdatedListener extends Listener<RoleUpdatedEvent> {
  subject: Subjects.ROLE_UPDATED = Subjects.ROLE_UPDATED;
  queueGroupName = queueGroupName;

  async onMessage(data: RoleUpdatedEvent['data'], msg: Message) {
    console.log('RoleUpdatedListener received data');
    const { id, name, resources, policy } = data;

    await User.updateMany();

    msg.ack();
  }
}
