import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Skeleton from '@material-ui/lab/Skeleton';

const SidebarMenuLoading: React.FC = props => {
  return (
    <List>
      <ListItem>
        <ListItemText>
          <Skeleton variant='rect' width='100%' height={24} animation='wave' />
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          <Skeleton variant='rect' width='100%' height={24} animation='wave' />
        </ListItemText>
      </ListItem>
    </List>
  );
};

export default SidebarMenuLoading;
