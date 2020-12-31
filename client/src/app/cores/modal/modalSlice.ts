import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  open: boolean;
  modalType: string | null;
  modalProps: any;
}

const initialState: ModalState = {
  open: false,
  modalType: null,
  modalProps: null,
};

const modalSLice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { modalType, modalProps } = action.payload;

      state.open = true;
      state.modalType = modalType;
      state.modalProps = modalProps;
    },
    closeModal: state => {
      state.open = false;
      state.modalType = null;
      state.modalProps = null;
    },
  },
});

export const { openModal, closeModal } = modalSLice.actions;
export default modalSLice.reducer;
