import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props {
  history: RouteComponentProps['history'];
}

const ImportRecords: React.FC<Props> = ({ history }) => {
  return <div>import records</div>;
};

export default ImportRecords;
