import React from 'react';
import { Listener, UserCreatedEvent } from '@tts-dev/common';
import { TestListener } from './TestListener';
import { Mixin, mix } from 'ts-mixer';
import { Message } from 'node-nats-streaming';
import { User } from 'app/types/user';

type TestState = {
  user: User;
};

interface TestComponentProps
  extends React.Component<{}, TestState>,
    Listener<UserCreatedEvent> {}

export class TestComponent extends Mixin(React.Component, TestListener) {
  // constructor(props) {
  //   super(props);
  //   this.state = {date: new Date()};
  // }
  state = { user: null };

  onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { username } = data;

    this.setState({
      user: { username },
    });

    msg.ack();
  }

  render() {
    return <div>Test component</div>;
  }
}
