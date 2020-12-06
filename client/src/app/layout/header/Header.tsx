import React from 'react';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

import ListIcon from '@material-ui/icons/List';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import useDrawer from 'hooks/useDrawer';
import { sidebarWidth, sidebarMinWidth } from 'app/configs/sidebar';
import ElevationScroll from '../commons/ElevationScroll';
import AuthMenu from './AuthMenu';

interface Props {
  setOpen: (...args: any[]) => void;
  open: boolean;
  title?: string;
}

const useStyles = makeStyles(theme => ({
  appBar: {
    marginLeft: sidebarMinWidth,
    width: `calc(100% - ${sidebarMinWidth}px)`,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.divider,
    borderBottomStyle: 'solid',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      width: '100%',
    },
  },
  appBarShift: {
    marginLeft: sidebarWidth,
    width: `calc(100% - ${sidebarWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  tabsIndicator: {
    display: 'none',
  },
  title: {
    textTransform: 'uppercase',
    fontSize: '1rem',
  },
  menuButton: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    boxShadow: theme.shadows[3],
  },
}));

const Header: React.FC<Props> = ({ setOpen, open, title }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { openDrawer } = useDrawer();

  const matchSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ElevationScroll>
      <AppBar
        color='inherit'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{ paddingLeft: 0 }}>
          <Grid container justify='space-between' alignItems='center'>
            <Grid item>
              <Grid container alignItems='center'>
                <Grid item>
                  <IconButton
                    onClick={() => {
                      if (matchSM) {
                        openDrawer('SidebarMenuDrawer');
                      } else {
                        setOpen(!open);
                      }
                    }}
                    className={classes.menuButton}
                  >
                    {open ? <ListIcon /> : <MoreVertIcon />}
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant='h6' className={classes.title}>
                    {title}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <AuthMenu />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
};

export default Header;
