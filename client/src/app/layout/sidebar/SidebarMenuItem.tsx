import React, { useMemo } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Omit } from '@material-ui/types';

interface Props {
  primary: string;
  isSelected: boolean;
  hasChild: boolean;
  isChild: boolean;
  isOpen: boolean;
  sidebarOpen: boolean;
  icon?: React.ReactNode;
  to?: string;
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}

const useStyles = makeStyles(theme => ({
  root: {
    transition: 'none !important',
  },
  selected: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
    color: '#fff',
    boxShadow: theme.shadows[4],
    borderRadius: 4,
    '& .MuiListItemIcon-root': {
      color: '#fff',
    },
  },
  nested: {
    paddingLeft: theme.spacing(9),
  },
}));

const SidebarMenuItem: React.FC<Props> = ({
  primary,
  isSelected,
  hasChild,
  isChild,
  isOpen,
  sidebarOpen,
  icon,
  to,
  onClick,
}) => {
  const classes = useStyles();
  const renderLink = useMemo(() => {
    if (!to) {
      return 'span';
    }

    return React.forwardRef<any, Omit<LinkProps, 'to'>>((itemProps, ref) => (
      <Link to={to} ref={ref} {...itemProps} />
    ));
  }, [to]);

  return (
    <ListItem
      button
      component={renderLink}
      classes={{
        selected: classes.selected,
        root: classes.root,
      }}
      className={clsx({
        [classes.selected]: isSelected,
        [classes.nested]: isChild,
      })}
      onClick={onClick}
    >
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText primary={primary} />

      {hasChild && sidebarOpen && (
        <ListItemSecondaryAction>
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default SidebarMenuItem;
