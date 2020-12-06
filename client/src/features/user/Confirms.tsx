import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import useAlert from 'hooks/useAlert';
import useModal from 'hooks/useModal';
import ConfirmModal from 'app/cores/modal/ConfirmModal';
import { modalActionTypes } from 'app/utils/constants';
import userAPI from 'app/api/userAPI';

interface Props {
  history: RouteComponentProps['history'];
}

const Confirms: React.FC<Props> = ({ history }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { alertSuccess, alertError } = useAlert();
  const { closeModal } = useModal();

  const handleDelete = async ({ ids }: { ids: string[] }) => {
    setLoading(true);
    try {
      await userAPI.deleteUsers(ids);

      setLoading(false);
      alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
      closeModal();
      history.push('/users');
    } catch (err) {
      console.log(err);
      setLoading(false);
      alertError(t('MESSAGE_ALERT_ERROR'));
    }
  };

  return (
    <ConfirmModal
      type={modalActionTypes.DELETE_USER}
      title={t('MODAL_TITLE_CONFIRM')}
      message={t('WARNING_DELETE_USER')}
      loading={loading}
      callback={handleDelete}
    />
  );
};

export default Confirms;
