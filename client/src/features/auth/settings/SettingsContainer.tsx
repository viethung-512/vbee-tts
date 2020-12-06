import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import MUITab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

import DefaultAvatar from 'app/layout/commons/DefaultAvatar';
import TabPanel from './TabPanel';
import AccountTab from './account-tab/AccountTab';
import SecureTab from './secure-tab/SecureTab';
import { AppState, AuthState } from 'app/redux/rootReducer';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  tabsWrapper: {
    backgroundColor: '#fff',
    padding: theme.spacing(1),
    boxShadow: theme.shadows[2],
    maxWidth: 300,
  },
  tabs: {
    width: '100%',
  },
  tabsIndicator: {
    display: 'none',
  },
  avatar: {
    width: 32,
    height: 32,
  },
}));

const Tab = withStyles(theme => ({
  root: {
    minWidth: 'unset',
    minHeight: 'unset',
    textTransform: 'unset',
    maxWidth: 'unset',
  },
  wrapper: {
    alignItems: 'flex-start',
    fontWeight: 400,
  },
  selected: {
    backgroundColor: theme.palette.secondary.light,
    color: '#fff',
  },
}))(MUITab);

const SettingsContainer: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { user: authUser, loading } = useSelector<AppState, AuthState>(
    state => state.auth
  );
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid container className={classes.container}>
      <Grid
        item
        container
        xs={3}
        direction='column'
        alignItems='center'
        style={{ marginRight: theme.spacing(2) }}
      >
        <Grid item container className={classes.tabsWrapper}>
          <Grid
            item
            container
            alignItems='center'
            justify='center'
            style={{ marginBottom: theme.spacing(1) }}
          >
            <Grid item style={{ marginRight: theme.spacing(1) }}>
              <Avatar
                alt='avatar'
                src={authUser?.photoURL}
                className={classes.avatar}
              >
                <DefaultAvatar />
              </Avatar>
            </Grid>

            <Grid item>
              {loading ? (
                <Skeleton variant='text' width={100} animation='wave' />
              ) : (
                <Typography variant='body1'>{authUser?.username}</Typography>
              )}
            </Grid>
          </Grid>
          <Grid item container>
            <Tabs
              orientation='vertical'
              variant='scrollable'
              value={value}
              onChange={handleChange}
              className={classes.tabs}
              classes={{ indicator: classes.tabsIndicator }}
            >
              <Tab label={t('TITLE_ACCOUNT')} />
              <Tab label={t('TITLE_SECURE_ACCOUNT')} />
            </Tabs>
          </Grid>
        </Grid>
      </Grid>
      <Grid item style={{ flex: 1 }}>
        <TabPanel value={value} index={0}>
          <AccountTab user={authUser} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SecureTab />
        </TabPanel>
      </Grid>
    </Grid>
  );
};

export default SettingsContainer;
