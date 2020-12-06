import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { FieldError } from '@tts-dev/common';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { updatePasswordValidator } from 'app/utils/validators';
import useAlert from 'hooks/useAlert';
import ChangePasswordForm, { UpdatePasswordField } from './ChangePasswordForm';
import { AppDispatch } from 'app/redux/store';
import { updatePassword } from '../../authSlice';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    boxShadow: theme.shadows[2],
  },
}));

const defaultValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const SecureTab: React.FC = props => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { alertSuccess } = useAlert();
  const {
    control,
    errors,
    formState,
    handleSubmit,
    setError,
  } = useForm<UpdatePasswordField>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(updatePasswordValidator),
  });

  const submitForm = handleSubmit(async values => {
    setLoading(true);

    const res = await dispatch(
      updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
    );

    if (res.meta.requestStatus === 'rejected') {
      const errs = res.payload as FieldError[];
      errs.forEach(e => {
        const field = e.field as 'oldPassword' | 'newPassword';
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
      <Grid item container direction='column'>
        <ChangePasswordForm
          control={control}
          submitForm={submitForm}
          errors={errors}
          isValid={formState.isValid}
          loading={loading}
        />
      </Grid>
    </Grid>
  );
};

export default SecureTab;
