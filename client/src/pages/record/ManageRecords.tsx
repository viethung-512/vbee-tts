import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ManageRecordsContainer from 'features/record/containers/ManageRecordsContainer';

interface Props {
  history: RouteComponentProps['history'];
}

const ManageRecords: React.FC<Props> = ({ history }) => {
  return <ManageRecordsContainer history={history} />;
};

export default ManageRecords;
