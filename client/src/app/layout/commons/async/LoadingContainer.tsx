import React from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Spinner from './Spinner';

interface Props {
  loading: boolean;
  size?: number;
  thickness?: number;
  color?: string;
}

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    opacity: '0.6 !important',
    backgroundColor: theme.palette.background.paper,
  },
}));

const LoadingContainer: React.FC<Props> = ({
  loading = false,
  size = 40,
  thickness = 4.5,
  color,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Backdrop className={classes.backdrop} open={loading}>
      <Spinner
        color={color ? color : theme.palette.primary.dark}
        size={size}
        thickness={thickness}
      />
    </Backdrop>
  );
};

export default LoadingContainer;
