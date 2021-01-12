import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import StatusTag from 'app/layout/commons/sentence-record/StatusTag';
import Button from 'app/layout/commons/form/Button';
import { Sentence } from 'app/types/sentence';
import { AppState, SentenceState } from 'app/redux/rootReducer';

interface Props {
  submitSentence: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  submitErrorSentence: (...args: any[]) => void;
  cancel: () => void;
  loading: boolean;
  submitSentenceLoading: boolean;
  isValid: boolean;
  sentence?: Sentence;
}

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  tag: {
    borderRadius: 6,
  },
  backButton: {
    boxShadow: theme.shadows[3],
    backgroundColor: '#fff',
    marginRight: theme.spacing(2),
  },
}));

const SentenceDetailsHeader: React.FC<Props> = ({
  loading,
  submitSentenceLoading,
  isValid,
  sentence,
  cancel,
  submitSentence,
  submitErrorSentence,
}) => {
  const { t }: { t: any } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const {
    firstSentence,
    lastSentence,
    nextSentence,
    previousSentence,
  } = useSelector<AppState, SentenceState>(state => state.sentence);

  const extraSentenceInitialized =
    firstSentence !== '' &&
    lastSentence !== '' &&
    nextSentence !== '' &&
    previousSentence !== '';

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
            <IconButton onClick={cancel} className={classes.backButton}>
              <ArrowBackIcon />
            </IconButton>
          </Grid>

          <Grid item>
            {loading ? (
              <Skeleton variant='text' width={100} />
            ) : (
              sentence && <StatusTag statusCode={sentence.status} />
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Button
          content={t('ACTIONS_SUBMIT_ERROR')}
          variant='secondary'
          onClick={submitErrorSentence}
          style={{ marginRight: theme.spacing(2) }}
        />
        <Button
          content={t('ACTIONS_SAVE_CHANGE')}
          variant='primary'
          onClick={submitSentence}
          disabled={
            submitSentenceLoading || !isValid || !extraSentenceInitialized
          }
          loading={submitSentenceLoading}
        />
      </Grid>
    </Grid>
  );
};

export default SentenceDetailsHeader;
