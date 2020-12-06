import { combineReducers } from '@reduxjs/toolkit';

import alertReducer from '../cores/alert/alertSlice';
import drawerReducer from '../cores/drawer/drawerSlice';
import modalReducer from '../cores/modal/modalSlice';
import authReducer from 'features/auth/authSlice';
// import sentenceReducer from 'features/sentence/sentenceSlice';

const rootReducer = combineReducers({
  alert: alertReducer,
  drawer: drawerReducer,
  modal: modalReducer,
  auth: authReducer,
  // sentence: sentenceReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type AuthState = ReturnType<typeof authReducer>;
export type AlertState = ReturnType<typeof alertReducer>;
export type DrawerState = ReturnType<typeof drawerReducer>;
export type ModalState = ReturnType<typeof modalReducer>;
// export type SentenceState = ReturnType<typeof sentenceReducer>;

export default rootReducer;
