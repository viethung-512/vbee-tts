import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import useDrawer from 'hooks/useDrawer';
import { sidebarWidth } from 'app/configs/sidebar';

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: '15em',
    width: sidebarWidth,
  },
}));

interface Props {
  drawerType: string;
  drawerWidth?: number;
}

const DrawerBase: React.FC<Props> = ({
  children,
  drawerWidth,
  drawerType,
  ...rest
}) => {
  const classes = useStyles();
  const { getDrawerStatus, closeDrawer } = useDrawer();

  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleClose = (event: React.SyntheticEvent<{}, Event>) => {
    closeDrawer();
  };

  const status = getDrawerStatus(drawerType);

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      open={status}
      onClose={handleClose}
      onOpen={() => {}}
      PaperProps={{
        className: classes.paper,
        style: drawerWidth ? { width: drawerWidth } : undefined,
      }}
      {...rest}
    >
      {children}
    </SwipeableDrawer>
  );
};

export default DrawerBase;
