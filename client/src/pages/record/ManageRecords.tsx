import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props {
  history: RouteComponentProps['history'];
}

const ManageRecords: React.FC<Props> = ({ history }) => {
  return <div>manage records</div>;
};

export default ManageRecords;
