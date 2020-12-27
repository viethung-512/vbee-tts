import React from 'react';
import { Mixin } from 'ts-mixer';
import { Listener, DemoEvent, Subjects } from '@tts-dev/common';
import { Message } from 'node-nats-streaming';

import Typography from '@material-ui/core/Typography';

class MyComponent extends React.Component<{}, { demo: string }> {}

class MyListener extends Listener<DemoEvent> {
  queueGroupName = 'demo-queue';
  subject: Subjects.DEMO_SUBJECT = Subjects.DEMO_SUBJECT;

  onMessage(data: DemoEvent['data'], msg: Message) {}
}

export default class ListenComponent extends Mixin(MyComponent, MyListener) {
  state = {
    demo: 'init string',
  };

  onMessage(data: DemoEvent['data'], msg: Message) {
    const { demo } = data;

    this.setState({
      demo: demo,
    });

    msg.ack();
  }

  render() {
    return (
      <div>
        <Typography gutterBottom>List component</Typography>

        <Typography>{this.state.demo}</Typography>
      </div>
    );
  }
}
