import React from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';

import { sidebarWidth, sidebarMinWidth } from 'app/configs/sidebar';
import { AppState, UIState } from 'app/redux/rootReducer';
import SidebarMain from './SidebarMain';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: sidebarWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: sidebarWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down('sm')]: {
      width: 0,
    },
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: sidebarMinWidth,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    [theme.breakpoints.down('sm')]: {
      width: 0,
    },
  },
}));

const SidebarV2 = () => {
  const classes = useStyles();
  const { sidebarOpen } = useSelector<AppState, UIState>(state => state.ui);

  return (
    <Drawer
      variant='permanent'
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: sidebarOpen,
        [classes.drawerClose]: !sidebarOpen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: sidebarOpen,
          [classes.drawerClose]: !sidebarOpen,
        }),
      }}
    >
      <SidebarMain isInDrawer={false} />
    </Drawer>
  );
};

export default SidebarV2;
