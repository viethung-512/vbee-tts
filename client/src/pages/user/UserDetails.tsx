import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import UserDetailsContainer from 'features/user/container/UserDetailsContainer';

interface Props {
  match: RouteComponentProps<{ id: string }>['match'];
  history: RouteComponentProps['history'];
}

const UserDetails: React.FC<Props> = ({ match, history }) => {
  const userId = match.params.id;

  return (
    <div style={{ backgroundColor: 'inherit' }}>
      <UserDetailsContainer userId={userId} history={history} />
    </div>
  );
};

export default UserDetails;
