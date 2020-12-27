import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import BroadcasterRecordContainer from 'features/broadcaster/containers/BroadcasterRecordContainer';

interface Props {
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100%',
  },
}));

const BroadcasterRecord: React.FC<Props> = ({ history }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <BroadcasterRecordContainer history={history} />
    </div>
  );
};

export default BroadcasterRecord;
