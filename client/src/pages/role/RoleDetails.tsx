import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import RoleDetailsContainer from 'features/role/containers/RoleDetailsContainer';
interface Props {
  history: RouteComponentProps['history'];
  match: RouteComponentProps<{ id: string }>['match'];
}

const RoleDetails: React.FC<Props> = ({ history, match }) => {
  const roleId = match.params.id;

  return (
    <div style={{ backgroundColor: 'inherit' }}>
      <RoleDetailsContainer history={history} roleId={roleId} />
    </div>
  );
};

export default RoleDetails;
