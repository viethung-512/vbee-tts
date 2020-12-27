import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import ManageTrainingContainer from 'features/training/containers/ManageTrainingContainer';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const ManageTraining: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ManageTrainingContainer />
    </div>
  );
};

export default ManageTraining;
