import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useAlert from 'hooks/useAlert';
import useModal from 'hooks/useModal';
import useMutation from 'hooks/useMutation';

import sentenceAPI from 'app/api/sentenceAPI';
import { submitErrorSentenceValidator } from 'app/utils/validators';
import ModalWrapper from 'app/cores/modal/ModalWrapper';
import Input from 'app/layout/commons/form/Input';
import Button from 'app/layout/commons/form/Button';
import { AppState, ModalState } from 'app/redux/rootReducer';
import { Sentence } from 'app/types/sentence';
import { setSentence } from '../sentenceSlice';

interface ErrorSentenceField {
  errorMessage: string;
}

const useStyles = makeStyles(theme => ({
  formItem: {
    marginBottom: theme.spacing(2),
  },
}));

const SubmitErrorSentenceModal: React.FC = () => {
  const { t }: { t: any } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [sentenceId, setSentenceId] = useState<string | null>('');
  const { closeModal } = useModal();
  const { alertSuccess } = useAlert();
  const { modalProps } = useSelector<AppState, ModalState>(
    state => state.modal
  );
  const {
    control,
    errors,
    formState,
    handleSubmit,
    setError,
  } = useForm<ErrorSentenceField>({
    mode: 'onChange',
    defaultValues: { errorMessage: '' },
    resolver: yupResolver(submitErrorSentenceValidator),
  });
  const { doRequest: submitErrorSentence, loading, result } = useMutation<
    ErrorSentenceField,
    Sentence
  >(sentenceAPI.submitErrorSentence, setError, () => {
    alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
    closeModal();
  });

  useEffect(() => {
    if (modalProps && modalProps.id) {
      setSentenceId(modalProps.id);
    } else {
      setSentenceId(null);
    }
  }, [modalProps]);

  useEffect(() => {
    if (result) {
      dispatch(setSentence(result));
    }
  }, [result, dispatch]);

  const submitForm = handleSubmit(async values => {
    await submitErrorSentence(sentenceId, values.errorMessage);
  });

  return (
    <ModalWrapper
      closeable={true}
      modalType='SubmitErrorSentenceModal'
      title={t('TITLE_ERROR_SENTENCE')}
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

export default SubmitErrorSentenceModal;
