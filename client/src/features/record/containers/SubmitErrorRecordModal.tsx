import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';

import useAlert from 'hooks/useAlert';
import useModal from 'hooks/useModal';
import useMutation from 'hooks/useMutation';

import recordAPI from 'app/api/recordAPI';
import { submitErrorSentenceValidator } from 'app/utils/validators';
import ModalWrapper from 'app/cores/modal/ModalWrapper';
import Input from 'app/layout/commons/form/Input';
import Button from 'app/layout/commons/form/Button';
import { AppState, ModalState } from 'app/redux/rootReducer';
import { setRecord } from '../recordSlice';
import { Record } from 'app/types/record';

interface ErrorRecordField {
  errorMessage: string;
}

const SubmitErrorRecordModal: React.FC = () => {
  const { t }: { t: any } = useTranslation();
  const dispatch = useDispatch();
  const [recordId, setRecordId] = useState<string | null>('');
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
  } = useForm<ErrorRecordField>({
    mode: 'onChange',
    defaultValues: { errorMessage: '' },
    resolver: yupResolver(submitErrorSentenceValidator),
  });
  const { doRequest: submitErrorRecord, loading, result } = useMutation<
    ErrorRecordField,
    Record
  >(recordAPI.submitErrorRecord, setError, () => {
    alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
    closeModal();
  });

  useEffect(() => {
    if (modalProps && modalProps.id) {
      setRecordId(modalProps.id);
    } else {
      setRecordId(null);
    }
  }, [modalProps]);

  useEffect(() => {
    if (result) {
      dispatch(setRecord(result));
    }
  }, [result, dispatch]);

  const submitForm = handleSubmit(async values => {
    await submitErrorRecord(recordId, values.errorMessage);
  });

  return (
    <ModalWrapper
      title={t('TITLE_SUBMIT_ERROR_RECORD')}
      modalType='SubmitErrorRecordModal'
      closeable={true}
      actions={
        <Fragment>
          <Button
            variant='success'
            onClick={submitForm}
            loading={loading}
            disabled={!formState.isValid || loading}
            content={t('ACTIONS_CONFIRM')}
          />
          <Button content={t('ACTIONS_CANCEL')} onClick={closeModal} />
        </Fragment>
      }
    >
      <form style={{ width: '100%' }}>
        <Grid container>
          <Grid item container>
            <Input
              size='small'
              control={control}
              name='errorMessage'
              label={t('FIELDS_ERROR_RECORD_CONTENT')}
              isError={Boolean(errors?.errorMessage)}
              errorMessage={errors?.errorMessage?.message}
            />
          </Grid>
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default SubmitErrorRecordModal;
