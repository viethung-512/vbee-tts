import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Input from 'app/layout/commons/form/Input';
import Button from 'app/layout/commons/form/Button';

export interface UpdatePasswordField {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Props {
  control: Control;
  isValid: boolean;
  loading: boolean;
  errors: FieldErrors<UpdatePasswordField>;
  submitForm: (event: React.FormEvent<HTMLFormElement>) => void;
}

const useStyles = makeStyles(theme => ({
  formItem: {
    marginBottom: theme.spacing(2),
  },
}));

const ChangePasswordForm: React.FC<Props> = ({
  control,
  submitForm,
  isValid,
  loading,
  errors,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <form style={{ width: '100%' }} onSubmit={submitForm}>
      <Grid container direction='column'>
        <Grid item container className={classes.formItem}>
          <Input
            size='small'
            type='password'
            name='oldPassword'
            label={t('FIELDS_OLD_PASSWORD')}
            control={control}
            isError={Boolean(errors?.oldPassword)}
            errorMessage={errors?.oldPassword?.message}
          />
        </Grid>
        <Grid item container className={classes.formItem}>
          <Input
            size='small'
            type='password'
            name='newPassword'
            label={t('FIELDS_NEW_PASSWORD')}
            control={control}
            isError={Boolean(errors?.newPassword)}
            errorMessage={errors?.newPassword?.message}
          />
        </Grid>
        <Grid item className={classes.formItem}>
          <Input
            size='small'
            type='password'
            name='confirmPassword'
            label={t('FIELDS_CONFIRM_PASSWORD')}
            control={control}
            isError={Boolean(errors?.confirmPassword)}
            errorMessage={errors?.confirmPassword?.message}
          />
        </Grid>
        <Grid item className={classes.formItem}>
          <Button
            variant='success'
            loading={loading}
            disabled={!isValid || loading}
            content={t('ACTIONS_CONFIRM')}
            type='submit'
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default ChangePasswordForm;
