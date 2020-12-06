import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import RoleDetailsContainer from 'features/role/containers/RoleDetailsContainer';
import Confirms from 'features/role/Confirms';

interface Props {
  history: RouteComponentProps['history'];
  match: RouteComponentProps<{ id: string }>['match'];
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'inherit',
  },
}));

const RoleDetails: React.FC<Props> = ({ history, match }) => {
  const classes = useStyles();
  const roleId = match.params.id;
  return (
    <Container className={classes.root}>
      <RoleDetailsContainer history={history} roleId={roleId} />
      <Confirms />
    </Container>
  );
};

export default RoleDetails;
