import { useDispatch, useSelector } from 'react-redux';
import {
  openModal as open,
  closeModal as close,
} from 'app/cores/modal/modalSlice';
import { AppState, ModalState } from 'app/redux/rootReducer';

const useModal = () => {
  const dispatch = useDispatch();
  const { open: status, modalType } = useSelector<AppState, ModalState>(
    state => state.modal
  );

  const openModal = (modalType: string, modalProps: any) =>
    dispatch(open({ modalType, modalProps }));

  const closeModal = () => dispatch(close());

  const getModalStatus = (type: string) =>
    type === modalType ? status : false;

  return {
    openModal,
    closeModal,
    getModalStatus,
  };
};

export default useModal;
