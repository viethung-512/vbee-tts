import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import useModal from 'hooks/useModal';
import ModalWrapper from './ModalWrapper';
import Button from 'app/layout/commons/form/Button';
import { AppState, ModalState } from 'app/redux/rootReducer';

interface Props {
  type: string;
  title: string;
  message: string;
  loading: boolean;
  callback: (...args: any[]) => void;
}

const ConfirmModal: React.FC<Props> = ({
  type,
  title,
  message,
  loading,
  callback,
}) => {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { modalProps } = useSelector<AppState, ModalState>(
    state => state.modal
  );

  const handleCallback = async () => {
    if (modalProps && modalProps.data) {
      await callback(modalProps.data);
    }
  };

  return (
    <Fragment>
      {modalProps && modalProps.type && modalProps.type === type && (
        <ModalWrapper
          title={title}
          actions={
            <Fragment>
              <Button
                variant='success'
                loading={loading}
                disabled={loading}
                content={t('ACTIONS_CONFIRM')}
                onClick={handleCallback}
              />
              <Button onClick={closeModal} content={t('ACTIONS_CANCEL')} />
            </Fragment>
          }
          closeable={true}
          modalType='ConfirmModal'
        >
          {message}
        </ModalWrapper>
      )}
    </Fragment>
  );
};

export default ConfirmModal;
