import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import usePermission from 'hooks/usePermission';
import Button from 'app/layout/commons/form/Button';
import { User } from 'app/types/user';

interface Props {
  isValid: boolean;
  loading: boolean;
  submitting: boolean;
  deleting: boolean;
  submitForm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleDelete: () => void;
  user?: User;
  userId?: string;
}

const useStyles = makeStyles(theme => ({
  backButton: {
    boxShadow: theme.shadows[3],
    backgroundColor: '#fff',
  },
}));

const UserDetailsHeader: React.FC<Props> = ({
  isValid,
  loading,
  submitting,
  deleting,
  userId,
  user,
  submitForm,
  handleDelete,
}) => {
  const { t }: { t: any } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { canCreateUser, canUpdateUser, canDeleteUser } = usePermission();

  const isShowSubmitButton = userId ? canUpdateUser : canCreateUser;

  const titleMarkup = loading ? (
    <Skeleton variant='text' animation='wave' width={150} />
  ) : (
    <Typography variant='h5'>
      {user ? user?.username : t('ACTIONS_ADD')}
    </Typography>
  );

  return (
    <Grid container justify='space-between' alignItems='center'>
      <Grid item>
        <Grid container alignItems='center'>
          <Grid item>
            <IconButton
              component={Link}
              to='/users'
              className={classes.backButton}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item style={{ marginLeft: theme.spacing(2) }}>
            {titleMarkup}
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container>
          <Grid item>
            {canDeleteUser && userId && (
              <Button
                content={t('ACTIONS_DELETE')}
                variant='secondary'
                disabled={submitting}
                style={{ marginRight: theme.spacing(2) }}
                onClick={() => {
                  handleDelete();
                }}
                loading={deleting}
              />
            )}
          </Grid>
          <Grid item>
            {isShowSubmitButton && (
              <Button
                content={t('ACTIONS_SAVE_CHANGE')}
                variant='primary'
                onClick={submitForm}
                disabled={!isValid || submitting}
                loading={submitting}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserDetailsHeader;
