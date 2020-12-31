import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ManageSentencesContainer from 'features/sentence/containers/ManageSentencesContainer';
interface Props {
  history: RouteComponentProps['history'];
}

const ManageSentences: React.FC<Props> = ({ history }) => {
  return <ManageSentencesContainer history={history} />;
};

export default ManageSentences;
