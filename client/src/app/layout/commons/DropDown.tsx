import React, { Fragment, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon, {
  ListItemIconProps,
} from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

interface Item {
  id: string;
  label: string;
  path?: string;
  borderBottom?: boolean;
  icon?: ListItemIconProps;
  callback: (...args: any[]) => void;
}

interface Props {
  menuItems: Item[];
}

const useStyles = makeStyles(theme => ({
  item: {
    '& .MuiListItemIcon-root': {
      minWidth: 'unset',
      marginRight: theme.spacing(2),
    },
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      color: '#fff',
      borderRadius: 4,
      boxShadow: theme.shadows[4],
    },
    '&:hover .MuiListItemIcon-root': {
      color: '#fff',
    },
  },
  paper: {
    boxShadow: theme.shadows[10],
    padding: theme.spacing(0.5),
    minWidth: '12em',
  },
}));

const DropDown: React.FC<Props> = ({ children, menuItems, ...rest }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }

    setOpen(false);
  };

  const handleItemClick = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLLIElement, MouseEvent>,
    callback: Item['callback']
  ) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }

    setOpen(false);
    if (callback) {
      callback();
    }
  };

  function handleListKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <Fragment>
      <div
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
      >
        {children}
      </div>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper className={classes.paper}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id='menu-list-grow'
                  onKeyDown={handleListKeyDown}
                  {...rest}
                  // style={{ padding: 0 }}
                >
                  {menuItems.map(item =>
                    item.path ? (
                      <MenuItem
                        onClick={(
                          e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                        ) => handleItemClick(e, item.callback)}
                        key={item.id}
                        className={classes.item}
                        component={Link}
                        to={item.path}
                        divider={item.borderBottom}
                      >
                        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                        <ListItemText>{item.label}</ListItemText>
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={e => handleItemClick(e, item.callback)}
                        key={item.id}
                        className={classes.item}
                        divider={item.borderBottom}
                      >
                        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                        <ListItemText>{item.label}</ListItemText>
                      </MenuItem>
                    )
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  );
};

export default DropDown;
