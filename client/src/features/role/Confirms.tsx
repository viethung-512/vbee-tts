import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import useAlert from 'hooks/useAlert';
import useModal from 'hooks/useModal';
import ConfirmModal from 'app/cores/modal/ConfirmModal';
import { modalActionTypes } from 'app/utils/constants';
import roleAPI from 'app/api/roleAPI';

const Confirms: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { alertSuccess, alertError } = useAlert();
  const { closeModal } = useModal();

  const handleDelete = async ({ ids }: { ids: string[] }) => {
    setLoading(true);
    console.log('delete roles');
    try {
      const res = await roleAPI.deleteRoles(ids);

      console.log({ res });
      setLoading(false);
      alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
      closeModal();
      history.push('/roles');
    } catch (err) {
      console.log(err);
      setLoading(false);
      alertError(t('MESSAGE_ALERT_ERROR'));
    }
  };

  const handleApprove = async ({ ids }: { ids: string[] }) => {
    setLoading(true);
    try {
      await roleAPI.approveRoles(ids);
      setLoading(false);
      closeModal();
      history.push('/roles');
    } catch (err) {
      console.log(err);
      setLoading(false);
      alertError('MESSAGE_ALERT_ERROR');
    }
  };

  return (
    <Fragment>
      <ConfirmModal
        type={modalActionTypes.APPROVE_ROLE}
        title={t('MODAL_TITLE_CONFIRM')}
        message={t('WARNING_APPROVE_ROLE')}
        loading={loading}
        callback={handleApprove}
      />
      <ConfirmModal
        type={modalActionTypes.DELETE_ROLE}
        title={t('MODAL_TITLE_CONFIRM')}
        message={t('WARNING_DELETE_ROLE')}
        loading={loading}
        callback={handleDelete}
      />
    </Fragment>
  );
};

export default Confirms;
