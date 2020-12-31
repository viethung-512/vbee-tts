import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Skeleton from '@material-ui/lab/Skeleton';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';

import HistoryIcon from '@material-ui/icons/History';

import useDrawer from 'hooks/useDrawer';
import usePermission from 'hooks/usePermission';
import Input from 'app/layout/commons/form/Input';
import { formatUID, getDialectInput } from 'app/utils/helper';
import { Sentence } from 'app/types/sentence';
import { SentenceType } from '@tts-dev/common';

interface Props {
  sentence?: Sentence;
  loading: boolean;
  control: Control;
  errors: FieldErrors<SentenceActionField>;
}

export interface SentenceActionField {
  original: string;
  dialectHN: string;
  dialectSG: string;
  type: SentenceType;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    backgroundColor: '#fff',
    width: '100%',
    boxShadow: theme.shadows[2],
  },
  title: {
    fontWeight: 500,
  },
  formItem: {
    marginBottom: theme.spacing(2),
  },
  errorLabel: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}));

const SentenceDetailsContent: React.FC<Props> = ({
  sentence,
  loading,
  control,
  errors,
}) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const { isRootUser } = usePermission();
  const { openDrawer } = useDrawer();

  return (
    <div className={classes.root}>
      <Grid container direction='column'>
        {sentence && sentence.errorMessage && (
          <Grid
            item
            container
            justify='flex-end'
            style={{ marginBottom: theme.spacing(2) }}
          >
            <Chip
              className={classes.errorLabel}
              variant='outlined'
              size='small'
              label={sentence.errorMessage}
            />
          </Grid>
        )}

        <Grid
          item
          container
          style={{
            marginBottom: theme.spacing(3),
          }}
          alignItems='center'
        >
          <Grid item style={{ marginRight: theme.spacing(3) }}>
            <Grid container alignItems='center'>
              <Grid item style={{ marginRight: theme.spacing(1) }}>
                <Typography variant='body1' className={classes.title}>
                  UID:
                </Typography>
              </Grid>
              <Grid item>
                {loading ? (
                  <Skeleton variant='text' width={100} animation='wave' />
                ) : (
                  sentence && (
                    <Typography variant='body1' color='secondary'>
                      {formatUID(sentence.uid)}
                    </Typography>
                  )
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container alignItems='center'>
              <Grid item style={{ marginRight: theme.spacing(1) }}>
                <Typography variant='body1' className={classes.title}>
                  {t('FIELDS_SENTENCE_TYPE')}:
                </Typography>
              </Grid>
              <Grid item>
                {loading ? (
                  <Skeleton variant='text' width={100} animation='wave' />
                ) : (
                  <Typography variant='body1' color='secondary'>
                    {sentence?.type}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item style={{ marginLeft: 'auto' }}>
            <Tooltip title={t('ACTIONS_VIEW_HISTORY')}>
              <IconButton
                onClick={() =>
                  openDrawer('EditSentenceHistoryDrawer', { id: sentence?.id })
                }
              >
                <HistoryIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid item container>
          <form style={{ width: '100%' }}>
            <Grid container direction='column'>
              {isRootUser && (
                <Grid item className={classes.formItem}>
                  <Input
                    size='small'
                    name='type'
                    label={t('FIELDS_SENTENCE_TYPE')}
                    control={control}
                    // error={errors.type}
                    isError={Boolean(errors?.type)}
                    errorMessage={errors?.type?.message}
                    select
                  >
                    {Object.values(SentenceType).map(sentence => (
                      <MenuItem key={sentence} value={sentence}>
                        {sentence}
                      </MenuItem>
                    ))}
                  </Input>
                </Grid>
              )}

              <Grid item className={classes.formItem}>
                <Input
                  name='original'
                  label={t('FIELDS_SENTENCE_ORIGINAL')}
                  control={control}
                  isError={Boolean(errors?.original)}
                  errorMessage={errors?.original?.message}
                  multiline={true}
                  rows={3}
                />
              </Grid>
              {sentence &&
                sentence.dialects &&
                sentence.dialects.length > 0 &&
                sentence.dialects.map(dialect => {
                  const dialectInput = getDialectInput(dialect.name);
                  const isError = errors
                    ? Boolean(errors[dialectInput.name])
                    : false;
                  const errorMessage = errors
                    ? errors[dialectInput.name]?.message
                    : undefined;

                  return (
                    <Grid
                      item
                      key={dialectInput.name}
                      className={classes.formItem}
                    >
                      <Input
                        name={dialectInput.name}
                        label={dialectInput.label}
                        control={control}
                        // error={errors[dialectInput.name]}
                        isError={isError}
                        errorMessage={errorMessage}
                        multiline={true}
                        rows={3}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default SentenceDetailsContent;
