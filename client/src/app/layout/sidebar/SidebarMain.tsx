import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { NavLink, useHistory } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import useSidebar from 'hooks/useSidebar';
import useDrawer from 'hooks/useDrawer';
import { sidebarWidth, sidebarMinWidth } from 'app/configs/sidebar';
import { menus, otherMenu } from 'app/constants/sidebar-constants';
import { AppState, UIState, AuthState } from 'app/redux/rootReducer';
import { openSubMenu, activeSidebarItem } from 'app/cores/ui/uiSlice';
import SidebarMenuLoading from './SidebarMenuLoading';

interface Props {
  isInDrawer: boolean;
}

const useStyles = makeStyles(theme => ({
  opened: {
    background: theme.palette.grey[200],
    '& $primary, & $icon': {
      color: theme.palette.secondary.dark,
    },
  },
  child: {
    '& a': {
      paddingLeft: theme.spacing(6),
    },
  },
  active: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
    color: '#fff',
    boxShadow: theme.shadows[4],
    borderRadius: 4,
    '& .MuiListItemIcon-root': {
      color: '#fff',
    },
    '&:hover': {
      backgroundColor: `${theme.palette.secondary.light} !important`,
    },
  },
  nolist: {
    listStyle: 'none',
  },
  icon: {
    marginRight: 0,
    color: theme.palette.secondary.dark,
  },
  head: {
    paddingLeft: 16,
  },

  // origin
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
  logoWrapper: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
  },
  logo: {
    height: 40,
  },
  iconSelected: {
    color: '#fff',
  },
}));

function sortByKey(array: any, key: any) {
  return array.sort((a: any, b: any) => {
    const x = a[key];
    const y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

const SidebarMain: React.FC<Props> = ({ isInDrawer = false }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const { closeDrawer } = useDrawer();
  const { getPermissionForSidebarItem } = useSidebar();
  const { subMenuOpen: open, sidebarOpen, sidebarItemActive } = useSelector<
    AppState,
    UIState
  >(state => state.ui);
  const { loading } = useSelector<AppState, AuthState>(state => state.auth);

  const handleClick = (pathname: string) => {
    if (isInDrawer) {
      closeDrawer();
    }
    dispatch(activeSidebarItem(pathname));
  };

  const checkIsActiveLink = (link: string) => {
    return history.location.pathname.includes(link);
  };

  const getMenus = (menuArray: any[]) =>
    menuArray.map((item, index) => {
      const permission = getPermissionForSidebarItem(item.key);
      if (item.child) {
        return (
          item.child.some((childItem: any) => {
            const childPermission = getPermissionForSidebarItem(childItem.key);
            return childPermission === true;
          }) && (
            <div key={index.toString()}>
              <ListItem
                button
                className={clsx(classes.head, {
                  [classes.opened]: open.indexOf(item.key) > -1,
                })}
                onClick={() => {
                  dispatch(
                    openSubMenu({ key: item.key, keyParent: item.keyParent })
                  );
                }}
                // @ts-ignore
                isActive={() => checkIsActiveLink(item.link)}
              >
                {item.icon && (
                  <ListItemIcon>
                    <Icon
                      className={clsx(classes.icon, {
                        [classes.iconSelected]: sidebarItemActive === item.key,
                      })}
                    >
                      {item.icon}
                    </Icon>
                  </ListItemIcon>
                )}
                <ListItemText primary={t(item.name)} />
                {open.indexOf(item.key) > -1 ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse
                component='li'
                className={clsx(classes.nolist, {
                  [classes.child]: item.keyParent,
                })}
                in={open.indexOf(item.key) > -1}
                timeout='auto'
                unmountOnExit
              >
                <List>{getMenus(sortByKey(item.child, 'key'))}</List>
              </Collapse>
            </div>
          )
        );
      }

      return (
        permission && (
          <ListItem
            key={index.toString()}
            button
            // @ts-ignore
            exact
            isActive={() => checkIsActiveLink(item.link)}
            activeClassName={classes.active}
            component={NavLink}
            to={item.link}
            onClick={() => handleClick(item.link)}
          >
            {item.icon && (
              <ListItemIcon>
                <Icon
                  className={clsx(classes.icon, {
                    [classes.iconSelected]: sidebarItemActive === item.key,
                  })}
                >
                  {item.icon}
                </Icon>
              </ListItemIcon>
            )}
            <ListItemText inset={!item.icon} primary={t(item.name)} />
          </ListItem>
        )
      );
    });

  return (
    <div>
      <div className={classes.logoWrapper}>
        <img
          alt='vbee logo'
          src={sidebarOpen ? '/full-logo.png' : '/short-logo.png'}
          className={classes.logo}
        />
      </div>
      <Divider />
      {loading ? (
        <SidebarMenuLoading />
      ) : (
        <div style={{ padding: theme.spacing(1) }}>{getMenus(menus)}</div>
      )}

      <Divider />
      <div style={{ padding: theme.spacing(1) }}>{getMenus(otherMenu)}</div>
    </div>
  );
};

export default SidebarMain;
