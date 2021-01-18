import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import BroadcasterDetailsContainer from 'features/broadcaster/containers/BroadcasterDetailsContainer';

interface Props {
  match: RouteComponentProps<{ id: string }>['match'];
  history: RouteComponentProps['history'];
}

const BroadcasterDetails: React.FC<Props> = ({ match, history }) => {
  const broadcasterId = match.params.id;

  return (
    <div style={{ backgroundColor: 'inherit' }}>
      <BroadcasterDetailsContainer
        broadcasterId={broadcasterId}
        history={history}
      />
      {/* <Confirms history={history} /> */}
    </div>
  );
};

export default BroadcasterDetails;
