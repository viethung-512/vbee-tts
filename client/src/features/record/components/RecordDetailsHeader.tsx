import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';

import Button from 'app/layout/commons/form/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import StatusTag from 'app/layout/commons/sentence-record/StatusTag';
import { Record } from 'app/types/record';

interface Props {
  submitRecord: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  submitErrorRecord: (...args: any[]) => void;
  cancel: () => void;
  loading: boolean;
  submitRecordLoading: boolean;
  isValid: boolean;
  record?: Record;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  button: {
    width: '10em',
    textTransform: 'unset',
    borderRadius: 0,
    marginLeft: theme.spacing(2),
  },
  iconButton: {
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
    marginRight: theme.spacing(2),
  },
}));

const RecordDetailsHeader: React.FC<Props> = ({
  loading,
  submitRecordLoading,
  isValid,
  record,
  submitRecord,
  submitErrorRecord,
  cancel,
}) => {
  const classes = useStyles();
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  return (
    <Grid
      container
      justify='space-between'
      alignItems='center'
      className={classes.root}
    >
      <Grid item>
        <Grid container alignItems='center'>
          <Grid item>
            <IconButton className={classes.iconButton} onClick={cancel}>
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item>
            {loading ? (
              <Skeleton variant='text' width={100} />
            ) : (
              record && <StatusTag statusCode={record.status} />
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Button
          content={t('ACTIONS_SUBMIT_ERROR')}
          variant='secondary'
          onClick={submitErrorRecord}
          style={{ marginRight: theme.spacing(2) }}
        />
        <Button
          content={t('ACTIONS_SAVE_CHANGE')}
          variant='primary'
          onClick={submitRecord}
          disabled={submitRecordLoading || !isValid}
          loading={submitRecordLoading}
        />
      </Grid>
    </Grid>
  );
};

export default RecordDetailsHeader;
