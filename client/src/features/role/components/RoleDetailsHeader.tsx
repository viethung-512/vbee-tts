import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import useModal from 'hooks/useModal';
import usePermission from 'hooks/usePermission';
import Button from 'app/layout/commons/form/Button';
import { Role } from 'app/types/role';

interface Props {
  isValid: boolean;
  loading: boolean;
  submitting: boolean;
  submitForm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  role?: Role;
  roleId?: string;
}

const useStyles = makeStyles(theme => ({
  backButton: {
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
  },
}));

const RoleDetailsHeader: React.FC<Props> = ({
  isValid,
  loading,
  submitting,
  role,
  submitForm,
  roleId,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { openModal } = useModal();
  const { canCreateRole, canUpdateRole, canDeleteRole } = usePermission();

  const isShowDeleteButton = Boolean(roleId) && canDeleteRole;
  const isShowSubmitButton = Boolean(roleId) ? canUpdateRole : canCreateRole;

  const titleMarkup = loading ? (
    <Skeleton variant='text' animation='wave' width={150} />
  ) : (
    <Typography variant='h5'>{role ? role.name : t('ACTIONS_ADD')}</Typography>
  );

  return (
    <Grid container justify='space-between' alignItems='center'>
      <Grid item>
        <Grid container alignItems='center'>
          <Grid item>
            <IconButton
              component={Link}
              to='/roles'
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
        <Grid container justify='space-between' alignItems='center'>
          <Grid item>
            {isShowDeleteButton && (
              <Button
                content={t('ACTIONS_DELETE')}
                variant='secondary'
                disabled={submitting}
                onClick={() =>
                  openModal('ConfirmModal', {
                    data: { id: roleId },
                  })
                }
                style={{ marginRight: theme.spacing(2) }}
              />
            )}
          </Grid>
          <Grid item>
            {isShowSubmitButton && (
              <Button
                content={t('ACTIONS_SAVE_CHANGE')}
                variant='primary'
                onClick={submitForm}
                disabled={submitting || !isValid}
                loading={submitting}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RoleDetailsHeader;
