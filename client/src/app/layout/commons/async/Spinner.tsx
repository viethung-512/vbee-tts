import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

interface Props {
  size: number;
  thickness: number;
  color: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: theme.palette.primary.dark,
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

const Spinner: React.FC<Partial<Props>> = ({
  size = 24,
  thickness = 4,
  color = '#F2C94C',
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant='determinate'
        className={classes.bottom}
        size={size}
        thickness={thickness}
        {...rest}
        value={100}
      />
      <CircularProgress
        variant='indeterminate'
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        style={{ color: color ? color : theme.palette.primary.dark }}
        size={size}
        thickness={thickness}
        {...rest}
      />
    </div>
  );
};

export default Spinner;
