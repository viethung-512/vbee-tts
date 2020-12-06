import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props {
  history: RouteComponentProps['history'];
  match: RouteComponentProps<{ id: string }>['match'];
}

const SentenceDetails: React.FC<Props> = ({ history, match }) => {
  const sentenceId = match.params.id;

  console.log(sentenceId);

  return <div>sentences details</div>;
};

export default SentenceDetails;
