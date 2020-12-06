import { createSlice } from '@reduxjs/toolkit';

interface DrawerState {
  open: boolean;
  drawerType: string | null;
  drawerProps: any;
}

const initialState: DrawerState = {
  open: false,
  drawerType: null,
  drawerProps: null,
};

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state, action) => {
      const { drawerType, drawerProps } = action.payload;

      state.open = true;
      state.drawerType = drawerType;
      state.drawerProps = drawerProps;
    },
    closeDrawer: state => {
      state.open = false;
      state.drawerType = null;
      state.drawerProps = null;
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;

export default drawerSlice.reducer;
