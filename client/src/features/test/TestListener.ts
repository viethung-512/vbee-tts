import { Listener, Subjects, UserCreatedEvent } from '@tts-dev/common';
import { Message } from 'node-nats-streaming';

export class TestListener extends Listener<UserCreatedEvent> {
  queueGroupName = 'test';
  subject: Subjects.USER_CREATED = Subjects.USER_CREATED;
  onMessage(data: UserCreatedEvent['data'], msg: Message) {}
}
