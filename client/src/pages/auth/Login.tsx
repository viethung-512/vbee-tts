import React from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LoginContainer from 'features/auth/login/LoginContainer';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: 'linear-gradient(135deg, #fad961 0%,#f8b349 100%);',
    width: '100vw',
    minHeight: '100vh',
  },
}));

const LoginPage: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Grid
      container
      justify='center'
      alignItems='center'
      className={classes.root}
    >
      <LoginContainer history={history} />
    </Grid>
  );
};

export default LoginPage;
