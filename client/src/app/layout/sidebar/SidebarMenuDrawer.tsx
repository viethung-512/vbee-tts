import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';

import useSidebar from 'hooks/useSidebar';
import {
  sidebarMinWidth,
  sidebarWidth,
  SidebarItem,
} from 'app/configs/sidebar';
import SidebarMenuItem from './SidebarMenuItem';

import DrawerWrapper from 'app/cores/drawer/DrawerWrapper';

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
}));

const SidebarMenuDrawer: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const { sidebarMenus, getMenuSelected } = useSidebar();
  const [open] = useState(true);
  const [menu, setMenu] = useState<{ [name: string]: boolean }>(() => {
    const menuSelected = getMenuSelected(location.pathname);

    return menuSelected;
  });
  const [itemSelected, setItemSelected] = useState<string>(() => {
    return location.pathname;
  });

  useEffect(() => {
    if (location.pathname) {
      const selected = location.pathname;
      setItemSelected(selected);
    }
  }, [location.pathname]);

  const handleClick = (item: string, hasChild: boolean) => {
    if (hasChild) {
      const newData = {
        ...menu,
        [item]: !menu[item],
      };
      setMenu(newData);
    } else {
      setItemSelected(item);
    }
  };

  const handleMenu = (children: SidebarItem[], level: number = 0) => {
    return children.map(({ children, icon, name, path, label, permission }) => {
      if (!children) {
        return (
          permission && (
            <List key={name} component='div' disablePadding dense>
              <SidebarMenuItem
                icon={icon}
                isSelected={name === itemSelected}
                hasChild={false}
                isChild={level > 0}
                isOpen={Boolean(menu[name])}
                sidebarOpen={open}
                primary={label}
                to={path}
                onClick={() => handleClick(name, false)}
              />
            </List>
          )
        );
      }

      const collapseOpen = menu[name];

      return (
        permission && (
          <div key={name}>
            <SidebarMenuItem
              icon={icon}
              isSelected={name === itemSelected}
              hasChild={true}
              isChild={level > 0}
              isOpen={Boolean(menu[name])}
              sidebarOpen={open}
              primary={label}
              to={path}
              onClick={() => handleClick(name, true)}
            />
            <Collapse in={collapseOpen} timeout='auto' unmountOnExit>
              {handleMenu(children, 1)}
            </Collapse>
          </div>
        )
      );
    });
  };

  return (
    <DrawerWrapper drawerType='SidebarMenuDrawer'>
      <div className={classes.logoWrapper}>
        <img
          alt='vbee logo'
          src={open ? '/full-logo.png' : '/short-logo.png'}
          className={classes.logo}
        />
      </div>
      <Divider />
      {sidebarMenus
        .filter(menu => {
          return menu.data.some(d => {
            if (d.children && d.children.length > 0) {
              return d.children.some(c => c.permission);
            }

            return d.permission;
          });
        })
        .map(menu => {
          return (
            <List
              key={menu.name}
              disablePadding
              dense
              subheader={
                <ListSubheader component='div'>
                  {open ? (
                    menu.name
                  ) : (
                    <Divider style={{ marginTop: 16, marginBottom: 16 }} />
                  )}
                </ListSubheader>
              }
            >
              {handleMenu(menu.data)}
            </List>
          );
        })}
    </DrawerWrapper>
  );
};

export default SidebarMenuDrawer;
