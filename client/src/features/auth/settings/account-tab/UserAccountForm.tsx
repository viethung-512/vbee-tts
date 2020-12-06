import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Input from 'app/layout/commons/form/Input';
import Button from 'app/layout/commons/form/Button';

export interface UpdateAuthInfoField {
  firsName: string;
  lastName: string;
  username: string;
}

interface Props {
  control: Control;
  isValid: boolean;
  loading: boolean;
  errors: FieldErrors<UpdateAuthInfoField>;
  submitForm: (event: React.FormEvent<HTMLFormElement>) => void;
}

const useStyles = makeStyles(theme => ({
  formItem: {
    marginBottom: theme.spacing(2),
  },
}));

const UserAccountForm: React.FC<Props> = ({
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
            name='firstName'
            label={t('FIELDS_FIRST_NAME')}
            control={control}
            isError={Boolean(errors?.firsName)}
            errorMessage={errors?.firsName?.message}
          />
        </Grid>
        <Grid item container className={classes.formItem}>
          <Input
            size='small'
            name='lastName'
            label={t('FIELDS_LAST_NAME')}
            control={control}
            isError={Boolean(errors?.lastName)}
            errorMessage={errors?.lastName?.message}
          />
        </Grid>
        <Grid item container className={classes.formItem}>
          <Input
            size='small'
            name='username'
            label={t('FIELDS_USERNAME')}
            control={control}
            isError={Boolean(errors?.username)}
            errorMessage={errors?.username?.message}
          />
        </Grid>

        <Grid item className={classes.formItem}>
          <Button
            content={t('ACTIONS_SAVE_CHANGE')}
            loading={loading}
            disabled={!isValid || loading}
            type='submit'
            variant='success'
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default UserAccountForm;
