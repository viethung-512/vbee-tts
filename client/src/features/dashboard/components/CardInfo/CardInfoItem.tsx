import React from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

export interface InfoItem {
  total: number;
  current: number;
  percent: number;
  label: string;
  icon: string;
  bgColor?: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 300,
    borderRadius: 4,
    backgroundColor: '#fff',
    padding: theme.spacing(2),
    boxShadow: theme.shadows[3],
  },
}));

const CardInfoItem: React.FC<{ card: InfoItem }> = ({ card }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { total, current, percent, label, icon, bgColor } = card;

  return (
    <Grid
      container
      className={classes.root}
      style={{ backgroundColor: bgColor || '#fff' }}
      alignItems='center'
    >
      <Grid item style={{ marginRight: theme.spacing(2) }}>
        <Grid container direction='column' alignItems='center'>
          <Icon>{icon}</Icon>
          <Typography variant='body1'>{label}</Typography>
        </Grid>
      </Grid>
      <Grid item style={{ flex: 1 }}>
        <Grid container direction='column'>
          <Typography variant='h6'>
            Total:{' '}
            <span>
              {current}/{total}
            </span>
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            Percent: {percent} %
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CardInfoItem;
