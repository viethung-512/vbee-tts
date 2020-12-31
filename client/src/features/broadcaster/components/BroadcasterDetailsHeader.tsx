import React from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import usePermission from 'hooks/usePermission';
import Button from 'app/layout/commons/form/Button';

interface Props {
  isValid: boolean;
  loading: boolean;
  deleting: boolean;
  broadcasterId: string;
  title: JSX.Element;
  submitForm?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleDelete: (ids: string[]) => void;
}

const useStyles = makeStyles(theme => ({
  backButton: {
    boxShadow: theme.shadows[3],
    backgroundColor: '#fff',
  },
}));

const BroadcasterDetailsHeader: React.FC<Props> = ({
  isValid,
  loading,
  deleting,
  submitForm,
  handleDelete,
  broadcasterId,
  title,
}) => {
  const { t }: { t: any } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { isRootUser } = usePermission();

  return (
    <Grid container justify='space-between' alignItems='center'>
      <Grid item>
        <Grid container alignItems='center'>
          <Grid item>
            <IconButton
              component={Link}
              to='/broadcasters'
              className={classes.backButton}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item style={{ marginLeft: theme.spacing(2) }}>
            {title}
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container>
          <Grid item>
            {isRootUser && broadcasterId && (
              <Button
                style={{ marginRight: theme.spacing(2) }}
                variant='secondary'
                content={t('ACTIONS_DELETE')}
                disabled={loading}
                onClick={() => {
                  handleDelete([broadcasterId]);
                }}
                loading={deleting}
              />
            )}
          </Grid>
          <Grid item>
            {isRootUser && (
              <Button
                loading={loading}
                disabled={!isValid || loading}
                content={t('ACTIONS_SAVE_CHANGE')}
                variant='primary'
                onClick={submitForm}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BroadcasterDetailsHeader;
