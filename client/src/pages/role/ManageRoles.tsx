import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ManageRolesContainer from 'features/role/containers/ManageRolesContainer';

interface Props {
  history: RouteComponentProps['history'];
}

const ManageRoles: React.FC<Props> = ({ history }) => {
  return (
    <div>
      <ManageRolesContainer history={history} />
    </div>
  );
};

export default ManageRoles;
