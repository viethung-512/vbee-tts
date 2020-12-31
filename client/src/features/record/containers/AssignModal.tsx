import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SentenceType } from '@tts-dev/common';

import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import { autoAssignCount } from 'app/utils/config';
import Input from 'app/layout/commons/form/Input';
import Button from 'app/layout/commons/form/Button';
import AutoComplete from 'app/layout/commons/form/AutoComplete';
import ModalWrapper from 'app/cores/modal/ModalWrapper';

import useAlert from 'hooks/useAlert';
import useAutoComplete from 'hooks/useAutoComplete';
import useModal from 'hooks/useModal';
import useMutation from 'hooks/useMutation';
import userAPI from 'app/api/userAPI';
import recordAPI from 'app/api/recordAPI';
import { AppState, ModalState } from 'app/redux/rootReducer';
import { User } from 'app/types/user';
import { Record } from 'app/types/record';

interface AssignRecordField {
  checker: User | string;
  count?: number;
  type?: SentenceType;
}

const getDefaultValue = (isAutoAssign: boolean): AssignRecordField => {
  if (isAutoAssign) {
    return {
      checker: '',
      count: autoAssignCount[0],
      type: SentenceType.NEWS,
    };
  }

  return { checker: '' };
};

const AssignModal = () => {
  const { t }: { t: any } = useTranslation();
  const history = useHistory();
  const theme = useTheme();
  const { modalProps, modalType } = useSelector<AppState, ModalState>(
    state => state.modal
  );
  const { alertSuccess } = useAlert();
  const { closeModal } = useModal();

  const {
    loading: searching,
    searchData: users,
    setSearchData: setUsers,
    setSearchTerm,
  } = useAutoComplete(userAPI.getUsers, modalType !== 'AssignRecordModal');
  const {
    control,
    formState,
    errors,
    handleSubmit,
    reset,
    setError,
  } = useForm<AssignRecordField>({
    mode: 'onChange',
    defaultValues: getDefaultValue(Boolean(modalProps?.isAutoAssign)),
  });
  const { doRequest: assignRecords, loading } = useMutation<
    AssignRecordField,
    Record[]
  >(recordAPI.assignRecords, setError, () => {
    alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
    history.push('/records');
    closeModal();
  });

  useEffect(() => {
    if (modalProps && modalProps.isAutoAssign) {
      reset(getDefaultValue(Boolean(modalProps?.isAutoAssign)));
    }
  }, [modalProps, reset]);

  const submitForm = handleSubmit(async values => {
    let args: {
      checker: User | string;
      count?: number;
      type?: SentenceType;
      ids?: string[];
    } = {
      checker: (values.checker as User).id,
    };

    if (modalProps && modalProps.isAutoAssign) {
      args.count = values.count;
      args.type = values.type;
    } else {
      args.ids = modalProps.recordIds;
    }

    assignRecords(args);
  });

  return (
    <ModalWrapper
      modalType='AssignRecordModal'
      closeable={true}
      title={t('MODAL_TITLE_QUICK_ASSIGN')}
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
      <Grid container direction='column'>
        <Grid item style={{ marginBottom: theme.spacing(3) }}>
          <Typography variant='body1'>{t('MESSAGE_SELECT_USER')}</Typography>
        </Grid>

        <Grid item>
          <form style={{ width: '100%' }}>
            <Grid container>
              {modalProps && modalProps.isAutoAssign && (
                <Grid item container>
                  <Grid
                    item
                    container
                    xs
                    style={{ marginRight: theme.spacing(1) }}
                  >
                    <Input
                      size='small'
                      label={t('FIELDS_SENTENCE_COUNT')}
                      select
                      name='count'
                      control={control}
                      isError={false}
                      errorMessage=''
                    >
                      {autoAssignCount.map(count => (
                        <MenuItem key={count} value={count}>
                          {count}
                        </MenuItem>
                      ))}
                    </Input>
                  </Grid>
                  <Grid
                    item
                    container
                    xs
                    style={{
                      marginLeft: theme.spacing(1),
                    }}
                  >
                    <Input
                      size='small'
                      label={t('FIELDS_SENTENCE_TYPE')}
                      select
                      name='type'
                      control={control}
                      isError={false}
                      errorMessage=''
                    >
                      {Object.values(SentenceType).map(type => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Input>
                  </Grid>
                </Grid>
              )}

              <Grid item container xs style={{ marginTop: theme.spacing(2) }}>
                <AutoComplete
                  name='checker'
                  isError={Boolean(errors?.checker)}
                  errorMessage={(errors?.checker as any)?.message}
                  control={control}
                  label={t('MODEL_USER')}
                  setTerm={setSearchTerm}
                  labelField='username'
                  options={users}
                  setOptions={setUsers}
                  loading={searching}
                />
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default AssignModal;
