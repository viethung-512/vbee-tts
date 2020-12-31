import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, FieldErrors } from 'react-hook-form';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Input from 'app/layout/commons/form/Input';
import AutoComplete from 'app/layout/commons/form/AutoComplete';
import { Role } from 'app/types/role';

export interface UserActionField {
  username: string;
  email: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  role: Role | {};
}

interface Props {
  control: Control;
  errors: FieldErrors<UserActionField>;
  roles: Role[];
  searching: boolean;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  userId?: string;
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

const UserDetailsForm: React.FC<Props> = ({
  userId,
  control,
  errors,
  roles,
  searching,
  setRoles,
  setSearchTerm,
}) => {
  const { t }: { t: any } = useTranslation();
  const classes = useStyles();

  return (
    <form style={{ width: '100%' }}>
      <Grid container direction='column'>
        <Grid item className={classes.formItem}>
          <Input
            size='small'
            label={t('FIELDS_USERNAME')}
            name='username'
            control={control}
            isError={Boolean(errors?.username)}
            errorMessage={errors?.username?.message}
          />
        </Grid>
        <Grid item className={classes.formItem}>
          <Input
            size='small'
            label={t('FIELDS_EMAIL')}
            name='email'
            control={control}
            isError={Boolean(errors?.email)}
            errorMessage={errors?.email?.message}
          />
        </Grid>
        <Grid item className={classes.formItem}>
          <Input
            size='small'
            label={t('FIELDS_PHONE_NUMBER')}
            name='phoneNumber'
            control={control}
            isError={Boolean(errors?.phoneNumber)}
            errorMessage={errors?.phoneNumber?.message}
          />
        </Grid>
        {!userId && (
          <Fragment>
            <Grid item className={classes.formItem}>
              <Input
                size='small'
                type='password'
                label={t('FIELDS_PASSWORD')}
                name='password'
                control={control}
                isError={Boolean(errors?.password)}
                errorMessage={errors?.password?.message}
              />
            </Grid>
            <Grid item className={classes.formItem}>
              <Input
                size='small'
                type='password'
                label={t('FIELDS_CONFIRM_PASSWORD')}
                name='confirmPassword'
                control={control}
                isError={Boolean(errors?.confirmPassword)}
                errorMessage={errors?.confirmPassword?.message}
              />
            </Grid>
          </Fragment>
        )}
        <Grid item>
          <AutoComplete
            name='role'
            isError={Boolean(errors?.role)}
            errorMessage={(errors?.role as any)?.message}
            control={control}
            label={t('MODEL_ROLE')}
            setTerm={setSearchTerm}
            labelField='name'
            options={roles}
            setOptions={setRoles}
            loading={searching}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default UserDetailsForm;
