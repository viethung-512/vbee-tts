import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import RecordDetailsContainer from 'features/record/containers/RecordDetailsContainer';

interface Props {
  history: RouteComponentProps['history'];
  match: RouteComponentProps<{ id: string }>['match'];
}

const RecordDetails: React.FC<Props> = ({ history, match }) => {
  const recordId = match.params.id;

  console.log(recordId);

  return (
    <Container style={{ backgroundColor: 'inherit' }}>
      <RecordDetailsContainer recordId={recordId} history={history} />
    </Container>
  );
};

export default RecordDetails;
