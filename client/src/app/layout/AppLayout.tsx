import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';

interface Props {
  title: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey[100],
  },
}));

const AppLayout: React.FC<Props> = ({ children, title }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  // const { getTitle } = useRoutes();

  // const pageTitle = getTitle();

  return (
    <div className={classes.root}>
      <Header setOpen={setOpen} open={open} title={title} />
      <Sidebar open={open} />
      <div className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
