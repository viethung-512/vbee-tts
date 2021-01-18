import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { DialectType, FieldError } from '@tts-dev/common';
import vkBeautify from 'vkbeautify';
import LoadingBar from 'react-top-loading-bar';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import useAlert from 'hooks/useAlert';
import useAsync from 'hooks/useAsync';
import useModal from 'hooks/useModal';
import useMutation from 'hooks/useMutation';

import { updateSentenceValidator } from 'app/utils/validators';
import Navigation from 'app/layout/commons/sentence-record/Navigation';
import { AppDispatch } from 'app/redux/store';
import RecordDetailsHeader from '../components/RecordDetailsHeader';
import { AppState, RecordState } from 'app/redux/rootReducer';
import Audio from '../components/Audio';
import RecordActionForm, {
  RecordActionField,
} from '../components/RecordActionForm';
import {
  clearRecord,
  getFirstRecord,
  getLastRecord,
  getNextRecord,
  getPreviousRecord,
  getRecord,
} from '../recordSlice';
import { Record } from 'app/types/record';
import recordAPI from 'app/api/recordAPI';

interface Props {
  recordId: string;
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
    borderRadius: 4,
    padding: theme.spacing(2),
  },
  navigation: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const defaultValues: RecordActionField = {
  original: '',
  dialect: DialectType.HANOI,
  allophoneContent: '',
};

const RecordDetailsContainer: React.FC<Props> = ({ history, recordId }) => {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const {
    current,
    firstRecord,
    lastRecord,
    nextRecord,
    previousRecord,
  } = useSelector<AppState, RecordState>(state => state.record);
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
  } = useForm<RecordActionField>({
    mode: 'onChange',
    defaultValues: defaultValues,
    resolver: yupResolver(updateSentenceValidator),
  });
  const { doRequest: submitRecord, loading: submitRecordLoading } = useMutation<
    RecordActionField,
    Record
  >(recordAPI.submitRecord, setError, () => {
    alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
    if (nextRecord) {
      history.push(`/records/${nextRecord}`);
    } else {
      history.push(`/records`);
      alertInfo(t('MESSAGE_ALERT_INFO__NO_CHECKING_AVAILABLE'));
    }
  });

  useEffect(() => {
    let active = true;

    const fetchRecord = async (id: string) => {
      setLoading(true);
      const res = await dispatch(getRecord({ id }));

      if (res.meta.requestStatus === 'rejected') {
        const err = res.payload as FieldError[];
        console.log(err);
      } else {
        const record = res.payload as Record;
        reset({
          original: record.original,
          dialect: record.dialect,
          allophoneContent: record.allophoneContent
            ? vkBeautify.xml(record.allophoneContent.replace(/\s\s+/g, ' '))
            : '',
        });
      }

      setLoading(false);
    };

    if (active && recordId) {
      fetchRecord(recordId);
    }

    return () => {
      active = false;
      reset(defaultValues);
      dispatch(clearRecord());
    };
  }, [reset, dispatch, recordId]);

  useEffect(() => {
    let active = true;

    const fetchExtra = async (id: string) => {
      await dispatch(getFirstRecord());
      await dispatch(getLastRecord());
      await dispatch(getNextRecord({ id }));
      await dispatch(getPreviousRecord({ id }));
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

  const submitForm = handleSubmit(async values => {
    if (recordId) {
      console.log(values);
      await submitRecord(recordId, { ...values });
    }
  });

  const handleSubmitErrorRecord = () => {
    openModal('SubmitErrorRecordModal', { id: current?.id });
  };

  const handleGoFirst = () => {
    if (firstRecord) {
      history.push(`/records/${firstRecord}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__ALREADY_FIRST_SENTENCE'));
    }
  };
  const handleGoLast = () => {
    if (lastRecord) {
      history.push(`/records/${lastRecord}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__ALREADY_LAST_SENTENCE'));
    }
  };
  const handleNext = () => {
    if (nextRecord) {
      history.push(`/records/${nextRecord}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__NO_NEXT_SENTENCE'));
    }
  };
  const handlePrevious = () => {
    if (previousRecord) {
      history.push(`/records/${previousRecord}`);
    } else {
      alertInfo(t('MESSAGE_ALERT_INFO__NO_PREVIOUS_SENTENCE'));
    }
  };

  const handleCancel = () => history.push(`/records`);

  const disabled =
    firstRecord === '' ||
    lastRecord === '' ||
    nextRecord === '' ||
    previousRecord === '';

  return (
    <Grid className={classes.root}>
      <LoadingBar color={theme.palette.secondary.main} ref={ref} />
      <Grid item container>
        <RecordDetailsHeader
          cancel={handleCancel}
          submitRecord={submitForm}
          submitErrorRecord={handleSubmitErrorRecord}
          loading={loading}
          submitRecordLoading={submitRecordLoading}
          record={current}
          isValid={formState.isValid}
        />
      </Grid>

      <Grid item>
        <RecordActionForm
          control={control}
          errors={errors}
          loading={loading}
          record={current}
        />
      </Grid>
      <Grid item>
        <Audio record={current} />
      </Grid>
      <Grid item className={classes.navigation}>
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

export default RecordDetailsContainer;
