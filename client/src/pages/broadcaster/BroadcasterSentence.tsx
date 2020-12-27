import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import BroadcasterSentenceContainer from 'features/broadcaster/containers/BroadcasterSentenceContainer';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}));

interface Props {
  match: RouteComponentProps<{ id?: string }>['match'];
  history: RouteComponentProps['history'];
}

const BroadcasterSentence: React.FC<Props> = ({ match, history }) => {
  const { id } = match.params;
  const classes = useStyles();

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      className={classes.root}
    >
      <BroadcasterSentenceContainer history={history} sentenceId={id} />
    </Grid>
  );
};

export default BroadcasterSentence;
