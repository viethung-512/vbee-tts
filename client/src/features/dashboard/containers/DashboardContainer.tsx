import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CardInfo from '../components/CardInfo/CardInfo';

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: '#fff',
    // boxShadow: theme.shadows[3],
    // borderRadius: 4,
    // padding: theme.spacing(2),
    // minHeight: 150,
  },
}));

const Dashboard: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container direction='column'>
        <Grid item container>
          <CardInfo />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
