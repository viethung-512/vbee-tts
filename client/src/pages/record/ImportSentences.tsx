import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props {
  history: RouteComponentProps['history'];
}

const ImportSentences: React.FC<Props> = ({ history }) => {
  return <div>import sentences</div>;
};

export default ImportSentences;
