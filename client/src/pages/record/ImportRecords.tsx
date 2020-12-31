import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ImportRecordsContainer from 'features/record/containers/ImportRecordsContainer';
interface Props {
  history: RouteComponentProps['history'];
}

const ImportRecords: React.FC<Props> = ({ history }) => {
  return <ImportRecordsContainer history={history} />;
};

export default ImportRecords;
