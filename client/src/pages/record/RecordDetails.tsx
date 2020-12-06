import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props {
  history: RouteComponentProps['history'];
  match: RouteComponentProps<{ id: string }>['match'];
}

const RecordDetails: React.FC<Props> = ({ history, match }) => {
  const recordId = match.params.id;

  console.log(recordId);

  return <div>records details</div>;
};

export default RecordDetails;
