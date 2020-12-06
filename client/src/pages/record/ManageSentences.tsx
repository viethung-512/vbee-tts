import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props {
  history: RouteComponentProps['history'];
}

const ManageSentences: React.FC<Props> = ({ history }) => {
  return <div>manage sentences</div>;
};

export default ManageSentences;
