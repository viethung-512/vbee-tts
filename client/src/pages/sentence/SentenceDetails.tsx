import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import SentenceDetailsContainer from 'features/sentence/containers/SentenceDetailsContainer';

interface Props {
  history: RouteComponentProps['history'];
  match: RouteComponentProps<{ id: string }>['match'];
}

const SentenceDetails: React.FC<Props> = ({ history, match }) => {
  const sentenceId = match.params.id;

  return (
    <div style={{ backgroundColor: 'inherit' }}>
      <SentenceDetailsContainer sentenceId={sentenceId} history={history} />
    </div>
  );
};

export default SentenceDetails;
