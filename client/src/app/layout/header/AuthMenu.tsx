import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import DropDown from '../commons/DropDown';
import DefaultAvatar from '../commons/DefaultAvatar';
import { logout } from 'features/auth/authSlice';
import { AppState, AuthState } from 'app/redux/rootReducer';

const useStyles = makeStyles(theme => ({
  authButton: {
    '&:hover': {
      backgroundColor: 'inherit',
    },
    textTransform: 'unset',
    fontWeight: 400,
  },
  avatar: {
    width: 32,
    height: 32,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
}));

const AuthMenu: React.FC = props => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, loading } = useSelector<AppState, AuthState>(
    state => state.auth
  );

  const menuItems = [
    {
      id: 'setting',
      label: t('ACTIONS_SETTINGS'),
      path: '/settings',
      callback: () => {},
      borderBottom: true,
    },
    {
      id: 'sign-out',
      label: t('ACTIONS_LOGOUT'),
      path: '/',
      callback: async () => {
        await dispatch(logout());
      },
      borderBottom: false,
    },
  ];
  return (
    <DropDown menuItems={menuItems}>
      <Button
        disableRipple
        startIcon={
          <Avatar
            alt={t('MODEL_USER')}
            src={user?.photoURL}
            className={classes.avatar}
          >
            <DefaultAvatar />
          </Avatar>
        }
        endIcon={<ArrowDropDownIcon />}
        className={classes.authButton}
      >
        {loading ? (
          <Skeleton variant='text' width={100} />
        ) : (
          <Typography variant='body2'>{user?.username}</Typography>
        )}
      </Button>
    </DropDown>
  );
};

export default AuthMenu;
