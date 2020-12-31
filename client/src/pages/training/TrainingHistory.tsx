import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import TrainingHistoryContainer from 'features/training/containers/TrainingHistoryContainer';

interface Props {
  history: RouteComponentProps['history'];
}

const TrainingHistory: React.FC<Props> = ({ history }) => {
  return <TrainingHistoryContainer history={history} />;
};

export default TrainingHistory;
