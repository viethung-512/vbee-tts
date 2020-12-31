import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import SettingsContainer from 'features/auth/settings/SettingsContainer';

interface Props {
  history: RouteComponentProps['history'];
  match: RouteComponentProps['match'];
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
}));

const Settings: React.FC<Props> = ({ match, history }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SettingsContainer />
    </div>
  );
};

export default Settings;
