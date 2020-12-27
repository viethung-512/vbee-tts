import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useAlert from 'hooks/useAlert';
import useModal from 'hooks/useModal';
import useMutation from 'hooks/useMutation';

import broadcasterAPI from 'app/api/broadcasterAPI';
import { submitErrorSentenceValidator } from 'app/utils/validators';
import ModalWrapper from 'app/cores/modal/ModalWrapper';
import Input from 'app/layout/commons/form/Input';
import Button from 'app/layout/commons/form/Button';
import { AppState, ModalState } from 'app/redux/rootReducer';
import { Record } from 'app/types/record';

interface ErrorBroadcasterSentenceField {
  errorMessage: string;
}

const useStyles = makeStyles(theme => ({
  formItem: {
    marginBottom: theme.spacing(2),
  },
}));

const SubmitErrorBroadcasterSentence: React.FC = () => {
  const { t }: { t: any } = useTranslation();
  const classes = useStyles();
  const [uid, setUid] = useState<string | null>('');
  const { closeModal } = useModal();
  const { alertInfo } = useAlert();
  const { modalProps } = useSelector<AppState, ModalState>(
    state => state.modal
  );
  const {
    control,
    errors,
    formState,
    handleSubmit,
    setError,
  } = useForm<ErrorBroadcasterSentenceField>({
    mode: 'onChange',
    defaultValues: { errorMessage: '' },
    resolver: yupResolver(submitErrorSentenceValidator),
  });
  const { doRequest: submitErrorSentence, loading } = useMutation<
    ErrorBroadcasterSentenceField,
    Record
  >(broadcasterAPI.submitErrorBroadcasterSentence, setError, () => {
    alertInfo(t('MESSAGE_ALERT_INFO_SUBMIT_ERROR_SENTENCE'));
    closeModal();
  });

  useEffect(() => {
    if (modalProps && modalProps.uid) {
      setUid(modalProps.uid);
    } else {
      setUid(null);
    }
  }, [modalProps]);

  const submitForm = handleSubmit(async values => {
    await submitErrorSentence(uid, values.errorMessage);
  });

  return (
    <ModalWrapper
      closeable={true}
      modalType='SubmitErrorBroadcasterSentenceModal'
      title={t('TITLE_SUBMIT_ERROR_BROADCASTER_SENTENCE')}
      actions={
        <Fragment>
          <Button
            variant='success'
            onClick={submitForm}
            loading={loading}
            disabled={loading || !formState.isValid}
            content={t('ACTIONS_CONFIRM')}
          />
          <Button content={t('ACTIONS_CANCEL')} onClick={closeModal} />
        </Fragment>
      }
    >
      <Typography variant='body1' className={classes.formItem}>
        {t('MESSAGE_SUBMIT_ERROR_SENTENCE')}
      </Typography>
      <form style={{ width: '100%' }} onSubmit={submitForm}>
        <Grid container direction='column'>
          <Grid item className={classes.formItem}>
            <Input
              size='small'
              control={control}
              name='errorMessage'
              label={t('FIELDS_ERROR_SENTENCE_CONTENT')}
              isError={Boolean(errors?.errorMessage)}
              errorMessage={errors?.errorMessage?.message}
            />
          </Grid>
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default SubmitErrorBroadcasterSentence;
