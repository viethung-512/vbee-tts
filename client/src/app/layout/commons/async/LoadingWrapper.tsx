import React from 'react';
import { makeStyles } from '@material-ui/core';
import Spinner from './Spinner';

interface Props {
  loading: boolean;
  spinner?: React.FC;
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.default,
    opacity: 0.4,
  },
}));

const LoadingWrapper: React.FC<Props> = ({ loading, children, spinner }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {loading && (
        <div className={classes.container}>
          {spinner ? spinner : <Spinner size={32} color='red' thickness={4} />}
        </div>
      )}
      {children}
    </div>
  );
};

export default LoadingWrapper;
