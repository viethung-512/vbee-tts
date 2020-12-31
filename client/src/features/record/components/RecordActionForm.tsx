import React from 'react';
import { useTranslation } from 'react-i18next';
import { FieldErrors, Control } from 'react-hook-form';
import { DialectType } from '@tts-dev/common';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Skeleton from '@material-ui/lab/Skeleton';

import HistoryIcon from '@material-ui/icons/History';

import Input from 'app/layout/commons/form/Input';
import { formatUID } from 'app/utils/helper';
import { Record } from 'app/types/record';

export interface RecordActionField {
  original: string;
  dialect: DialectType;
}

interface Props {
  control: Control;
  loading: boolean;
  errors: FieldErrors<RecordActionField>;
  recordId?: string;
  record?: Record;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  container: {
    padding: theme.spacing(2),
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
  },
  formItem: {
    marginBottom: theme.spacing(2),
  },
  titleWrapper: {
    marginBottom: theme.spacing(2),
  },
  inputRoot: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const RecordActionForm: React.FC<Props> = ({
  control,
  errors,
  loading,
  recordId,
  record,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const { t }: { t: any } = useTranslation();

  return (
    <Grid container className={classes.root}>
      <Grid container direction='column' className={classes.container}>
        <Grid
          item
          container
          alignItems='center'
          justify='space-between'
          className={classes.titleWrapper}
        >
          <Grid item container alignItems='center' style={{ flex: 1 }}>
            <Grid item style={{ marginRight: theme.spacing(1) }}>
              <Typography variant='body1'>{t('TITLE_UID')}:</Typography>
            </Grid>

            <Grid item>
              {loading ? (
                <Skeleton variant='text' width={100} animation='wave' />
              ) : (
                record && (
                  <Typography variant='body1' color='secondary'>
                    {formatUID(record.uid)}
                  </Typography>
                )
              )}
            </Grid>
          </Grid>

          <Grid item>
            <Tooltip title={t('ACTIONS_VIEW_HISTORY')}>
              <IconButton>
                <HistoryIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid item>
          <form style={{ width: '100%' }}>
            <Grid container direction='column'>
              <Grid item container className={classes.formItem}>
                <Input
                  control={control}
                  multiline={true}
                  rows={3}
                  name='original'
                  label={t('FIELDS_RECORD_ORIGINAL')}
                  isError={Boolean(errors?.original)}
                  errorMessage={errors?.original?.message}
                />
              </Grid>
              <Grid item container className={classes.formItem}>
                {/* <Input
                  control={control}
                  multiline={true}
                  rows={3}
                  name='dialect'
                  label={t('FIELDS_DIALECT')}
                  error={errors.dialect}
                /> */}
                <Input
                  size='small'
                  name='dialect'
                  label='dialect'
                  control={control}
                  isError={Boolean(errors?.dialect)}
                  errorMessage={errors?.dialect?.message}
                  select
                >
                  {Object.values(DialectType).map(dialect => (
                    <MenuItem key={dialect} value={dialect}>
                      {dialect}
                    </MenuItem>
                  ))}
                </Input>
              </Grid>
              {/* <Grid item container>
                <TextField
                  variant='outlined'
                  style={{ width: '100%' }}
                  inputRef={allophoneRef}
                  defaultValue={allophoneContent}
                  multiline
                  rowsMax={20}
                  // label='Allophone'
                  className={classes.inputRoot}
                />
              </Grid> */}
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RecordActionForm;
