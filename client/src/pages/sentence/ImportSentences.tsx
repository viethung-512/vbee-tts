import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import ImportSentencesContainer from 'features/sentence/containers/ImportSentencesContainer';

interface Props {
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const ImportSentences: React.FC<Props> = ({ history }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ImportSentencesContainer />

      {/* TODO: add confirms */}
      {/* <Confirms /> */}
    </div>
  );
};

export default ImportSentences;
