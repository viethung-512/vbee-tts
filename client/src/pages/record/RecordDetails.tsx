import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import RecordDetailsContainer from 'features/record/containers/RecordDetailsContainer';

interface Props {
  history: RouteComponentProps['history'];
  match: RouteComponentProps<{ id: string }>['match'];
}

const RecordDetails: React.FC<Props> = ({ history, match }) => {
  const recordId = match.params.id;

  return (
    <div style={{ backgroundColor: 'inherit' }}>
      <RecordDetailsContainer recordId={recordId} history={history} />
    </div>
  );
};

export default RecordDetails;
