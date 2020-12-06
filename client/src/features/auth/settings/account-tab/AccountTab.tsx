import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { FieldError } from '@tts-dev/common';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { userUpdateProfileValidator } from 'app/utils/validators';
import UserAccountForm from './UserAccountForm';
import UserAvatarUpload from './UserAvatarUpload';
import useAlert from 'hooks/useAlert';
import { User } from 'app/types/user';
import { AppDispatch } from 'app/redux/store';
import { updateAuthProfile } from 'features/auth/authSlice';

interface Props {
  user?: User | null;
}

const defaultValues = {
  firstName: '',
  lastName: '',
  username: '',
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    boxShadow: theme.shadows[2],
  },
}));

const AccountTab: React.FC<Props> = ({ user: authUser }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const { alertSuccess } = useAlert();
  const [loading, setLoading] = useState(false);
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
  const { control, errors, formState, handleSubmit, reset, setError } = useForm(
    {
      mode: 'onChange',
      defaultValues,
      resolver: yupResolver(userUpdateProfileValidator),
    }
  );

  useEffect(() => {
    if (authUser) {
      const formValues = {
        firstName: authUser.firstName || '',
        lastName: authUser.lastName || '',
        username: authUser.username || '',
      };
      reset(formValues);
    }

    return () => {
      reset(defaultValues);
    };
  }, [authUser, reset]);

  const submitForm = handleSubmit(async ({ firstName, lastName, username }) => {
    setLoading(true);

    const res = await dispatch(
      updateAuthProfile({
        id: authUser?.id!,
        data: { firstName, lastName, username },
      })
    );

    if (res.meta.requestStatus === 'rejected') {
      const errs = res.payload as FieldError[];
      errs.forEach(e => {
        const field = e.field as 'firstName' | 'lastName' | 'username';
        const message = e.message;

        setError(field, { message });
      });
    } else {
      alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
    }

    setLoading(false);
  });

  return (
    <Grid container direction='column' className={classes.root}>
      <Grid item>
        <Typography variant='h6' gutterBottom>
          {t('TITLE_USER_ACCOUNT')}
        </Typography>
      </Grid>
      <Divider style={{ marginBottom: theme.spacing(2) }} />
      <Grid item container direction={matchesSM ? 'column-reverse' : 'row'}>
        <Grid item container md={8} sm={12}>
          <UserAccountForm
            control={control}
            submitForm={submitForm}
            errors={errors}
            isValid={formState.isValid}
            loading={loading}
          />
        </Grid>
        <Grid
          item
          container
          md={4}
          sm={12}
          style={matchesSM ? { marginBottom: theme.spacing(2) } : {}}
        >
          <UserAvatarUpload authPhotoURL={authUser?.photoURL} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AccountTab;
