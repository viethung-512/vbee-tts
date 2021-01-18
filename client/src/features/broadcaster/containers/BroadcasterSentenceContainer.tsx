import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DialectType, FieldError, SentenceType } from '@tts-dev/common';
import LoadingBar from 'react-top-loading-bar';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import useAlert from 'hooks/useAlert';
import useAsync from 'hooks/useAsync';
import useAutoComplete from 'hooks/useAutoComplete';
import broadcasterAPI from 'app/api/broadcasterAPI';

import BroadcasterSentenceHeader from '../components/BroadcasterSentenceHeader';
import BroadcasterSentenceActions from '../components/BroadcasterSentenceActions';
import BroadcasterSentenceMainContent from '../components/BroadcasterSentenceMainContent';
import BroadcasterSentenceTopActions from '../components/BroadcasterSentenceTopActions';

import { AppState, BroadcasterState } from 'app/redux/rootReducer';
import { AppDispatch } from 'app/redux/store';
import {
  getBroadcasterSentence,
  getFirstSentence,
  getLastSentence,
  getNextSentence,
  getPreviousSentence,
  setBroadcasterSentence,
} from '../broadcasterSlice';
import { Sentence } from 'app/types/sentence';
import { BroadcasterSentence } from 'app/types/broadcaster';

interface Props {
  sentenceId?: string;
  history: RouteComponentProps['history'];
}

export interface BroadcasterSentenceFields {
  search: string;
  type: SentenceType;
  dialect: DialectType;
}

const defaultValues: BroadcasterSentenceFields = {
  search: '',
  type: SentenceType.BOOK,
  dialect: DialectType.HANOI,
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    borderRadius: 4,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2),
  },
  item: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
}));

const BroadcasterSentenceContainer: React.FC<Props> = ({
  sentenceId,
  history,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  const { t }: { t: any } = useTranslation();
  const {
    firstSentence,
    lastSentence,
    nextSentence,
    previousSentence,
    current,
    currentDialect,
  } = useSelector<AppState, BroadcasterState>(state => state.broadcaster);
  const { alertInfo, alertSuccess, alertError } = useAlert();
  const { ref, startLoading, endLoading } = useAsync();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const [finishRecordLoading, setFinishRecordLoading] = useState(false);

  const {
    loading: searching,
    searchData: sentences,
    setSearchData: setSentences,
    setSearchTerm,
  } = useAutoComplete<Sentence>(broadcasterAPI.getBroadcasterSentences);
  const { control, handleSubmit, reset } = useForm<BroadcasterSentenceFields>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    let active = true;

    const fetchBroadcasterSentence = async (id: string) => {
      setLoading(true);
      startLoading();
      const res = await dispatch(
        getBroadcasterSentence({
          id,
          dialect: currentDialect || DialectType.HANOI,
        })
      );

      if (res.meta.requestStatus === 'rejected') {
        const err = res.payload as FieldError[];
        console.log(err);
      } else {
        reset({
          type: (res.payload as BroadcasterSentence).type,
          search: '',
          dialect: (res.payload as BroadcasterSentence).dialect,
        });
      }

      setLoading(false);
      endLoading();
    };

    if (active && sentenceId) {
      fetchBroadcasterSentence(sentenceId);
    }

    return () => {
      active = false;
    };
  }, [reset, dispatch, sentenceId]);

  useEffect(() => {
    let active = true;

    const fetchExtra = async (id: string) => {
      await dispatch(getFirstSentence());
      await dispatch(getLastSentence());
      await dispatch(getNextSentence({ id }));
      await dispatch(getPreviousSentence({ id }));
    };

    if (active && current) {
      fetchExtra(current.id);
    }

    return () => {
      active = false;
    };
  }, [current, dispatch]);

  const handleFinishRecord = handleSubmit(values => {
    if (sentenceId) {
      setFinishRecordLoading(true);
      broadcasterAPI
        .toggleFinishRecord(sentenceId, values.dialect)
        .then(res => {
          dispatch(
            setBroadcasterSentence({
              id: res.id,
              uid: res.uid,
              completed: res.completed,
              dialect: res.dialect,
              type: res.type,
              original: res.original,
              pronunciation: res.pronunciation,
              originalImage: res.originalImage,
              dialectImage: res.dialectImage,
            })
          );
          alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
        })
        .catch(err => {
          console.log(err);
          alertError(t('MESSAGE_ALERT_ERROR'));
        })
        .finally(() => {
          setFinishRecordLoading(false);
        });
    }
  });

  const handleGoFirst = () => {
    if (current && current.id !== firstSentence) {
      history.push(`/broadcaster-record/${firstSentence}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__ALREADY_FIRST_SENTENCE'));
    }
  };
  const handleGoLast = () => {
    if (current && current.id !== lastSentence) {
      history.push(`/broadcaster-record/${lastSentence}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__ALREADY_LAST_SENTENCE'));
    }
  };
  const handleNext = () => {
    console.log({ nextSentence });
    if (nextSentence) {
      history.push(`/broadcaster-record/${nextSentence}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__NO_NEXT_SENTENCE'));
    }
  };
  const handlePrevious = () => {
    if (previousSentence) {
      history.push(`/broadcaster-record/${previousSentence}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__NO_PREVIOUS_SENTENCE'));
    }
  };

  const completed = Boolean((current as BroadcasterSentence)?.completed);
  const originalImage = (current as BroadcasterSentence)?.originalImage;
  const dialectImage = (current as BroadcasterSentence)?.dialectImage;
  const uid = (current as BroadcasterSentence)?.uid;

  return (
    <Grid
      container
      justify='center'
      alignItems='flex-start'
      className={classes.root}
    >
      <Grid item container direction='column' style={{ maxWidth: '40em' }}>
        <LoadingBar color={theme.palette.secondary.main} ref={ref} />
        <Grid item className={classes.item}>
          <BroadcasterSentenceTopActions
            handleFinishRecord={handleFinishRecord}
            finishRecordLoading={finishRecordLoading}
            completed={completed}
            uid={uid}
          />
        </Grid>
        <Grid item className={classes.item}>
          <BroadcasterSentenceHeader
            control={control}
            searching={searching}
            setSearchTerm={setSearchTerm}
            sentences={sentences}
            setSentences={setSentences}
            history={history}
          />
        </Grid>

        <Grid item className={classes.item}>
          <BroadcasterSentenceMainContent
            loading={loading}
            completed={completed}
            originalImage={originalImage}
            dialectImage={dialectImage}
            uid={uid}
          />
        </Grid>

        <Grid item>
          <BroadcasterSentenceActions
            handleGoFirst={handleGoFirst}
            handleGoLast={handleGoLast}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BroadcasterSentenceContainer;
