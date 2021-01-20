import React from 'react';
import { useSelector } from 'react-redux';
import ModalWrapper from 'app/cores/modal/ModalWrapper';
import { AppState, ModalState } from 'app/redux/rootReducer';

const TrainingErrorModal = () => {
  const { modalProps } = useSelector<AppState, ModalState>(
    state => state.modal
  );
  return (
    <ModalWrapper
      modalType='TrainingErrorModal'
      closeable={true}
      title='Training Error'
    >
      {modalProps?.message}
    </ModalWrapper>
  );
};

export default TrainingErrorModal;
