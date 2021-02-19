import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import cyan from '@material-ui/core/colors/cyan';

import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import Breadcrumbs from './header/Breadcrumbs';

interface Props {
  title: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    minHeight: '100vh',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  container: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey[100],
    boxSizing: 'border-box',
  },
  topContent: {
    backgroundColor: cyan[500],
    color: '#fff',
    height: 100,
    padding: theme.spacing(1, 2),
  },
  mainContent: {
    width: `calc(100% - ${theme.spacing(4)}px)`,
    top: theme.spacing(-6),
    position: 'absolute',
    padding: theme.spacing(0, 2),
  },
}));

const AppLayout: React.FC<Props> = ({ children, title }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header title={title} />

      <Sidebar />
      <div className={classes.container}>
        <div className={classes.toolbar} />
        <Grid container direction='column'>
          <Grid item container className={classes.topContent}>
            <Breadcrumbs />
          </Grid>
          <Grid item container style={{ position: 'relative', width: '100%' }}>
            <div className={classes.mainContent}>{children}</div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AppLayout;
