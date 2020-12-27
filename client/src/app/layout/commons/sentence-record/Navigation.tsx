import React from 'react';
import { useTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MUIIconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

interface Props {
  handleGoFirst: (...args: any[]) => void;
  handleGoLast: (...args: any[]) => void;
  handleNext: (...args: any[]) => void;
  handlePrevious: (...args: any[]) => void;
  disabled: boolean;
}

const IconButton = withStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
  },
}))(MUIIconButton);

const Navigation: React.FC<Props> = ({
  handleGoFirst,
  handleGoLast,
  handleNext,
  handlePrevious,
  disabled,
}) => {
  const { t }: { t: any } = useTranslation();

  const actions = [
    {
      title: t('ACTIONS_GO_FIRST'),
      icon: <FastRewindIcon />,
      callback: handleGoFirst,
    },
    {
      title: t('ACTIONS_GO_PREVIOUS'),
      icon: <SkipPreviousIcon />,
      callback: handlePrevious,
    },
    {
      title: t('ACTIONS_GO_NEXT'),
      icon: <SkipNextIcon />,
      callback: handleNext,
    },
    {
      title: t('ACTIONS_GO_LAST'),
      icon: <FastForwardIcon />,
      callback: handleGoLast,
    },
  ];
  return (
    <Grid container justify='space-between'>
      {disabled
        ? actions.map(action => (
            <Grid item key={action.title}>
              <IconButton
                color='secondary'
                onClick={action.callback}
                disabled={disabled}
              >
                {action.icon}
              </IconButton>
            </Grid>
          ))
        : actions.map(action => (
            <Grid item key={action.title}>
              <Tooltip title={action.title}>
                <IconButton color='secondary' onClick={action.callback}>
                  {action.icon}
                </IconButton>
              </Tooltip>
            </Grid>
          ))}
    </Grid>
  );
};

export default Navigation;
