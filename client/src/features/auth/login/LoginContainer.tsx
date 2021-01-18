import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FieldError } from '@tts-dev/common';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import cyan from '@material-ui/core/colors/cyan';

import { loginValidator } from 'app/utils/validators';
import { AppDispatch } from 'app/redux/store';
import LoginForm, { LoginFields } from './LoginForm';
import { login } from '../authSlice';
import { activeSidebarItem } from 'app/cores/ui/uiSlice';

interface Props {
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    maxWidth: 800,
    [theme.breakpoints.down('sm')]: {
      width: '60%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
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
  welcomeWrapper: {
    backgroundColor: cyan[200],
    padding: theme.spacing(5, 5),
    borderRadius: 4,
    boxShadow: theme.shadows[3],
    height: '100%',
    position: 'absolute',
    [theme.breakpoints.up('lg')]: {
      height: 'calc(100% + 40px)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  welcome: {},
  logoWrapper: {
    marginBottom: theme.spacing(2),
  },
  logo: {
    height: 36,
    marginRight: theme.spacing(3),
  },
  loginWrapper: {
    backgroundColor: '#fff',
    borderRadius: 4,
    boxShadow: theme.shadows[3],
    paddingBottom: theme.spacing(3),
  },
  loginTitle: {
    borderBottom: `3px solid ${theme.palette.secondary.main}`,
  },
  loginItem: {
    padding: theme.spacing(2, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, 5),
    },
  },
}));

const LoginContainer: React.FC<Props> = ({ history }) => {
  const classes = useStyles();
  const { t } = useTranslation();
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
      dispatch(activeSidebarItem('/dashboard'));
    }

    setLoading(false);
  });

  return (
    <div className={classes.container}>
      <Grid container alignItems='center' style={{ position: 'relative' }}>
        <Grid item md={6} className={classes.welcomeWrapper}>
          <Hidden smDown>
            <Grid
              style={{ height: '100%' }}
              container
              direction='column'
              justify='center'
            >
              <Grid
                item
                container
                alignItems='center'
                className={classes.logoWrapper}
              >
                <img
                  src='/short-logo.png'
                  alt='Vbee logo'
                  className={classes.logo}
                />
                <Typography variant='h6'>Vbee</Typography>
              </Grid>

              <Grid item container>
                <Typography variant='h4' color='textSecondary'>
                  Xin chào,
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  welcome to Vbee Training Tools
                </Typography>
              </Grid>
            </Grid>
          </Hidden>
        </Grid>

        <Grid item xs={12} md={6} style={{ marginLeft: 'auto' }}>
          <Grid container direction='column' className={classes.loginWrapper}>
            <Grid item container className={classes.loginItem}>
              <Grid item>
                <Typography variant='h5' className={classes.loginTitle}>
                  {t('TITLE_LOGIN')}
                </Typography>
              </Grid>
            </Grid>

            <Grid item className={classes.loginItem}>
              <LoginForm
                control={control}
                submitForm={submitForm}
                isValid={formState.isValid}
                loading={loading}
                errors={errors}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginContainer;
