import React, { useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmProvider } from 'material-ui-confirm';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AlertManager from 'app/cores/alert/AlertManager';
import DrawerManager from 'app/cores/drawer/DrawerManager';
import ModalManager from 'app/cores/modal/ModalManager';
import AppRoutes from './AppRoutes';
import { getMe } from 'features/auth/authSlice';
import { AppDispatch } from 'app/redux/store';
import { AppState, AuthState } from 'app/redux/rootReducer';

const useStyles = makeStyles(theme => ({
  btnRoot: {
    width: '10em',
    borderRadius: 0,
    textTransform: 'unset',
  },
  btnSuccess: {
    ...theme.custom.successButton.contained,
  },
  btnError: {
    ...theme.custom.errorButton.contained,
  },
}));

const App: React.FC = props => {
  const classes = useStyles();
  const { t }: { t: any } = useTranslation();
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
      <ConfirmProvider
        defaultOptions={{
          title: t('MODAL_TITLE_CONFIRM'),
          confirmationText: t('ACTIONS_CONFIRM'),
          cancellationText: t('ACTIONS_CANCEL'),
          confirmationButtonProps: {
            className: clsx(classes.btnRoot, classes.btnSuccess),
          },
          cancellationButtonProps: { className: clsx(classes.btnRoot) },
        }}
      >
        <AlertManager />
        <DrawerManager />
        <ModalManager />
        <AppRoutes loading={loading} />
      </ConfirmProvider>
    </div>
  );
};

export default App;
