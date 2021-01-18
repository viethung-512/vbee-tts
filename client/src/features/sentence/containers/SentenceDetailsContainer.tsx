import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { DialectType, FieldError, SentenceType } from '@tts-dev/common';
import LoadingBar from 'react-top-loading-bar';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import useAlert from 'hooks/useAlert';
import useAsync from 'hooks/useAsync';
import useModal from 'hooks/useModal';
import useMutation from 'hooks/useMutation';

import SentenceDetailsHeader from '../components/SentenceDetailsHeader';
import SentenceDetailsContent, {
  SentenceActionField,
} from '../components/SentenceDetailsContent';
import { updateSentenceValidator } from 'app/utils/validators';
import { Sentence } from 'app/types/sentence';
import Navigation from 'app/layout/commons/sentence-record/Navigation';
import { AppDispatch } from 'app/redux/store';
import {
  clearSentence,
  getFirstSentence,
  getLastSentence,
  getNextSentence,
  getPreviousSentence,
  getSentence,
} from '../sentenceSlice';
import { AppState, SentenceState } from 'app/redux/rootReducer';
import sentenceAPI from 'app/api/sentenceAPI';

interface Props {
  sentenceId: string;
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
    borderRadius: 4,
    padding: theme.spacing(2),
  },
  header: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  container: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  navigation: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const defaultValues: SentenceActionField = {
  original: '',
  dialectHN: '',
  dialectSG: '',
  type: SentenceType.BOOK,
};

const SentenceDetailsContainer: React.FC<Props> = ({ sentenceId, history }) => {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const {
    current,
    firstSentence,
    lastSentence,
    nextSentence,
    previousSentence,
  } = useSelector<AppState, SentenceState>(state => state.sentence);
  const { alertError, alertSuccess, alertInfo } = useAlert();
  const { ref, startLoading, endLoading } = useAsync();

  const { openModal } = useModal();
  const {
    control,
    errors,
    formState,
    handleSubmit,
    reset,
    setError,
  } = useForm<SentenceActionField>({
    mode: 'onChange',
    defaultValues: defaultValues,
    resolver: yupResolver(updateSentenceValidator),
  });
  const {
    doRequest: submitSentence,
    loading: submitSentenceLoading,
  } = useMutation<SentenceActionField, Sentence>(
    sentenceAPI.submitSentence,
    setError,
    () => {
      alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
      if (nextSentence) {
        history.push(`/sentences/${nextSentence}`);
      } else {
        history.push(`/sentences`);
        alertInfo(t('MESSAGE_ALERT_INFO__NO_CHECKING_AVAILABLE'));
      }
    }
  );

  useEffect(() => {
    let active = true;

    const fetchSentence = async (id: string) => {
      setLoading(true);
      startLoading();
      const res = await dispatch(getSentence({ id }));

      if (res.meta.requestStatus === 'rejected') {
        const err = res.payload as FieldError[];
        console.log(err);
      } else {
        const sentence = res.payload as Sentence;
        reset({
          type: sentence.type,
          original: sentence.original,
          dialectHN: sentence.dialects.find(d => d.name === DialectType.HANOI)!
            .pronunciation,
          dialectSG: sentence.dialects.find(d => d.name === DialectType.SAIGON)!
            .pronunciation,
        });
      }

      setLoading(false);
      endLoading();
    };

    if (active && sentenceId) {
      fetchSentence(sentenceId);
    }

    return () => {
      active = false;
      reset(defaultValues);
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

  useEffect(() => {
    if (errors && Object.values(errors).length > 0) {
      alertError(t('MESSAGE_ALERT_ERROR'));
    }
  }, [errors, alertError, t]);

  useEffect(() => {
    return () => {
      dispatch(clearSentence());
    };
  }, [dispatch]);

  const handleCancel = () => history.push(`/sentences`);

  const submitForm = handleSubmit(async values => {
    if (sentenceId) {
      await submitSentence(sentenceId, { ...values });
    }
  });

  const handleSubmitErrorSentence = () => {
    openModal('SubmitErrorSentenceModal', { id: current?.id });
  };

  const handleGoFirst = () => {
    if (firstSentence) {
      history.push(`/sentences/${firstSentence}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__ALREADY_FIRST_SENTENCE'));
    }
  };
  const handleGoLast = () => {
    if (lastSentence) {
      history.push(`/sentences/${lastSentence}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__ALREADY_LAST_SENTENCE'));
    }
  };
  const handleNext = () => {
    if (nextSentence) {
      history.push(`/sentences/${nextSentence}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__NO_NEXT_SENTENCE'));
    }
  };
  const handlePrevious = () => {
    if (previousSentence) {
      history.push(`/sentences/${previousSentence}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__NO_PREVIOUS_SENTENCE'));
    }
  };

  const disabled =
    firstSentence === '' ||
    lastSentence === '' ||
    nextSentence === '' ||
    previousSentence === '';

  return (
    <Grid className={classes.root}>
      <LoadingBar color={theme.palette.secondary.main} ref={ref} />
      <Grid item container className={classes.header}>
        <SentenceDetailsHeader
          cancel={handleCancel}
          submitSentence={submitForm}
          submitErrorSentence={handleSubmitErrorSentence}
          loading={loading}
          submitSentenceLoading={submitSentenceLoading}
          sentence={current}
          isValid={formState.isValid}
        />
      </Grid>

      <Grid item container className={classes.container}>
        <SentenceDetailsContent
          sentence={current}
          loading={loading}
          control={control}
          errors={errors}
        />
      </Grid>
      <Grid item container className={classes.navigation}>
        <Navigation
          handleGoFirst={handleGoFirst}
          handleGoLast={handleGoLast}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          disabled={disabled}
        />
      </Grid>
    </Grid>
  );
};

export default SentenceDetailsContainer;
