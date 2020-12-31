import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DemoEventPublisher } from 'app/events/publishers/demo-event-publisher';
import { natsWrapper } from 'app/utils/nats-wrapper';

import ListenComponent from './ListenComponent';

const DemoSubscription: React.FC = () => {
  const theme = useTheme();

  const handlePublish = async () => {
    await new DemoEventPublisher(natsWrapper.client).publish({
      demo: `This is demo string: $${Math.random()}`,
    });
  };

  return (
    <Grid style={{ padding: theme.spacing(2) }}>
      <Typography gutterBottom style={{ marginBottom: theme.spacing(2) }}>
        Demo Subscription
      </Typography>
      <Button variant='contained' color='primary' onClick={handlePublish}>
        Subscription
      </Button>

      <ListenComponent />
    </Grid>
  );
};

export default DemoSubscription;
