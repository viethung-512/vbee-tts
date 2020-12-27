import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ManageUsersContainer from 'features/user/container/ManageUsersContainer';

interface Props {
  history: RouteComponentProps['history'];
}

const ManageUsers: React.FC<Props> = ({ history }) => {
  return <ManageUsersContainer history={history} />;
};

export default ManageUsers;
