import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Container from '@material-ui/core/Container';

import BroadcasterDetailsContainer from 'features/broadcaster/containers/BroadcasterDetailsContainer';

interface Props {
  match: RouteComponentProps<{ id: string }>['match'];
  history: RouteComponentProps['history'];
}

const BroadcasterDetails: React.FC<Props> = ({ match, history }) => {
  const broadcasterId = match.params.id;

  return (
    <Container style={{ backgroundColor: 'inherit' }}>
      <BroadcasterDetailsContainer
        broadcasterId={broadcasterId}
        history={history}
      />
      {/* <Confirms history={history} /> */}
    </Container>
  );
};

export default BroadcasterDetails;
