import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ImportSentencesContainer from 'features/sentence/containers/ImportSentencesContainer';
interface Props {
  history: RouteComponentProps['history'];
}

const ImportSentences: React.FC<Props> = ({ history }) => {
  return (
    <div>
      <ImportSentencesContainer history={history} />
    </div>
  );
};

export default ImportSentences;
