import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';

import AlertManager from 'app/cores/alert/AlertManager';
import DrawerManager from 'app/cores/drawer/DrawerManager';
import ModalManager from 'app/cores/modal/ModalManager';
import AppRoutes from './AppRoutes';
import { getMe } from 'features/auth/authSlice';
import { AppDispatch } from 'app/redux/store';
import { AppState, AuthState } from 'app/redux/rootReducer';

const App: React.FC = props => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector<AppState, AuthState>(state => state.auth);

  useEffect(() => {
    const fetchAuthUser = async () => {
      await dispatch(getMe());
    };

    fetchAuthUser();
  }, [dispatch]);

  return (
    <div className='App'>
      <AlertManager />
      <DrawerManager />
      <ModalManager />
      <AppRoutes loading={loading} />
    </div>
  );
};

export default App;
