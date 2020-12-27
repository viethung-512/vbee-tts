import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ManageBroadcasterContainer from 'features/broadcaster/containers/ManageBroadcasterContainer';

interface Props {
  history: RouteComponentProps['history'];
}

const ManageBroadcasters: React.FC<Props> = ({ history }) => {
  return <ManageBroadcasterContainer history={history} />;
};

export default ManageBroadcasters;
