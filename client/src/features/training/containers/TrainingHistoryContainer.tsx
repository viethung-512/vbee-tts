import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface Props {
  history: RouteComponentProps['history'];
}

const TrainingHistoryContainer: React.FC<Props> = ({ history }) => {
  return <div>Training history container</div>;
};

export default TrainingHistoryContainer;
