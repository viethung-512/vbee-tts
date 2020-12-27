import { combineReducers } from '@reduxjs/toolkit';

import alertReducer from '../cores/alert/alertSlice';
import drawerReducer from '../cores/drawer/drawerSlice';
import modalReducer from '../cores/modal/modalSlice';
import authReducer from 'features/auth/authSlice';
import sentenceReducer from 'features/sentence/sentenceSlice';
import recordReducer from 'features/record/recordSlice';
import broadcasterReducer from 'features/broadcaster/broadcasterSlice';

const rootReducer = combineReducers({
  alert: alertReducer,
  drawer: drawerReducer,
  modal: modalReducer,
  auth: authReducer,
  sentence: sentenceReducer,
  record: recordReducer,
  broadcaster: broadcasterReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
export type AuthState = ReturnType<typeof authReducer>;
export type AlertState = ReturnType<typeof alertReducer>;
export type DrawerState = ReturnType<typeof drawerReducer>;
export type ModalState = ReturnType<typeof modalReducer>;
export type SentenceState = ReturnType<typeof sentenceReducer>;
export type RecordState = ReturnType<typeof recordReducer>;
export type BroadcasterState = ReturnType<typeof broadcasterReducer>;

export default rootReducer;
