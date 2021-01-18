import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

interface Props {
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
    borderRadius: 4,
    padding: theme.spacing(2),
    minHeight: 150,
  },
}));

const TrainingHistoryContainer: React.FC<Props> = ({ history }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant='h6' gutterBottom>
        Training history container
      </Typography>
      <Typography variant='body1'>This will show the table</Typography>
    </div>
  );
};

export default TrainingHistoryContainer;
