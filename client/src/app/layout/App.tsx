import React, { useEffect } from 'react';
import './App.css';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmProvider } from 'material-ui-confirm';
import { useTranslation } from 'react-i18next';
import LoadingBar from 'react-top-loading-bar';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AlertManager from 'app/cores/alert/AlertManager';
import DrawerManager from 'app/cores/drawer/DrawerManager';
import ModalManager from 'app/cores/modal/ModalManager';
import AppRoutes from './AppRoutes';
import { getMe } from 'features/auth/authSlice';
import { initOpenSubMenu, activeSidebarItem } from 'app/cores/ui/uiSlice';
import { AppDispatch } from 'app/redux/store';
import { AppState, AuthState } from 'app/redux/rootReducer';
import useAsync from 'hooks/useAsync';

const useStyles = makeStyles(theme => ({
  app: {
    minHeight: '100vh',
  },
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
  const history = useHistory();
  const { ref, startLoading, endLoading } = useAsync();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector<AppState, AuthState>(state => state.auth);
  const theme = useTheme();

  useEffect(() => {
    const fetchAuthUser = async () => {
      startLoading();
      await dispatch(getMe());
      endLoading();
    };

    fetchAuthUser();

    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    const currentPath = history.location.pathname;

    if (currentPath.split('/').length > 2) {
      const arr = currentPath.split('/');
      arr.splice(-1, 1);

      console.log(arr.join('/'));

      dispatch(initOpenSubMenu(arr.join('/')));
      dispatch(activeSidebarItem(arr.join('/')));
    } else {
      dispatch(initOpenSubMenu(currentPath));
      dispatch(activeSidebarItem(currentPath));
    }

    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.app}>
      <LoadingBar color={theme.palette.secondary.main} ref={ref} />
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
