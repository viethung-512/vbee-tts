import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FieldError } from '@tts-dev/common';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { loginValidator } from 'app/utils/validators';
import { AppDispatch } from 'app/redux/store';
import LoginForm, { LoginFields } from './LoginForm';
import { login } from '../authSlice';

interface Props {
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    maxWidth: '30em',
    backgroundColor: '#fff',
    padding: theme.spacing(3),
    boxShadow: theme.shadows[3],
  },
  title: {
    marginBottom: theme.spacing(4),
    fontSize: '2rem',
  },
}));

const LoginContainer: React.FC<Props> = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const {
    control,
    errors,
    formState,
    handleSubmit,
    setError,
  } = useForm<LoginFields>({
    mode: 'onChange',
    defaultValues: { phoneNumber: '', password: '' },
    resolver: yupResolver(loginValidator),
  });

  const submitForm = handleSubmit(async ({ phoneNumber, password }) => {
    setLoading(true);
    const loginRes = await dispatch(login({ phoneNumber, password }));

    if (loginRes.meta.requestStatus === 'rejected') {
      const errs = loginRes.payload as FieldError[];
      errs.forEach(er => {
        const field = er.field as 'phoneNumber' | 'password';
        const message = er.message;

        setError(field, { message });
      });
    } else {
      history.push('/dashboard');
    }

    setLoading(false);
  });

  return (
    <Container className={classes.container}>
      <Grid container direction='column' className={classes.form}>
        <Grid item>
          <Typography variant='h5' className={classes.title} align='center'>
            Vbee Training Tools
          </Typography>
        </Grid>
        <Grid item container>
          <LoginForm
            control={control}
            submitForm={submitForm}
            isValid={formState.isValid}
            loading={loading}
            errors={errors}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginContainer;
