import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Color } from '@material-ui/lab/Alert';

interface AlertState {
  open: boolean;
  status: Color;
  message: string;
}

const initialState: AlertState = {
  open: false,
  status: 'info',
  message: '',
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    success: (state, action: PayloadAction<string>) => {
      state.open = true;
      state.status = 'success';
      state.message = action.payload;
    },
    error: (state, action) => {
      state.open = true;
      state.status = 'error';
      state.message = action.payload;
    },
    warning: (state, action) => {
      state.open = true;
      state.status = 'warning';
      state.message = action.payload;
    },
    info: (state, action) => {
      state.open = true;
      state.status = 'info';
      state.message = action.payload;
    },
    clear: state => {
      state.open = false;
      state.message = '';
    },
  },
});

export const { success, error, warning, info, clear } = alertSlice.actions;
export default alertSlice.reducer;
