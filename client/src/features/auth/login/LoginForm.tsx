import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Spinner from 'app/layout/commons/async/Spinner';
import Input from 'app/layout/commons/form/Input';

export interface LoginFields {
  phoneNumber: string;
  password: string;
}

interface Props {
  control: Control;
  isValid: boolean;
  loading: boolean;
  errors: FieldErrors<LoginFields>;
  submitForm: (event: React.FormEvent<HTMLFormElement>) => void;
}

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%',
  },
  formItem: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    width: '15em',
    borderRadius: 24,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}));

const LoginForm: React.FC<Props> = ({
  control,
  submitForm,
  isValid,
  loading,
  errors,
}) => {
  const classes = useStyles();
  const { t }: { t: any } = useTranslation();

  return (
    <form onSubmit={submitForm} className={classes.form}>
      <Grid container direction='column'>
        <Grid item className={classes.formItem}>
          <Input
            control={control}
            name='phoneNumber'
            // error={errors.phoneNumber}
            isError={Boolean(errors?.phoneNumber)}
            errorMessage={errors?.phoneNumber?.message}
            label={t('FIELDS_PHONE_NUMBER')}
          />
        </Grid>
        <Grid item className={classes.formItem}>
          <Input
            control={control}
            name='password'
            type='password'
            // error={errors.password}
            isError={Boolean(errors?.password)}
            errorMessage={errors?.password?.message}
            label={t('FIELDS_PASSWORD')}
          />
        </Grid>

        <Grid item container justify='center' className={classes.formItem}>
          <Button
            variant='contained'
            color='primary'
            size='large'
            type='submit'
            disabled={!isValid || loading}
            className={classes.submitButton}
          >
            {loading ? <Spinner /> : t('ACTIONS_LOGIN')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginForm;
