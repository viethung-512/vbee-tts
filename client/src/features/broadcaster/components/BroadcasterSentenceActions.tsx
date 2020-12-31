import React from 'react';
import { useTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import MUIIconButton from '@material-ui/core/IconButton';

import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';

interface Props {
  handleGoFirst: () => void;
  handleGoLast: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
}

const IconButton = withStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
  },
}))(MUIIconButton);

const BroadcasterSentenceActions: React.FC<Props> = ({
  handleGoFirst,
  handleGoLast,
  handleNext,
  handlePrevious,
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
      {actions.map(action => (
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

export default BroadcasterSentenceActions;
