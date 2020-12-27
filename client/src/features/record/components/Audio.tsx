import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Record } from 'app/types/record';

interface Props {
  record?: Record;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  container: {
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2),
  },
}));

const Audio: React.FC<Props> = ({ record }) => {
  const classes = useStyles();
  const { t }: { t: any } = useTranslation();

  return (
    <Grid container className={classes.root}>
      <Grid container className={classes.container}>
        {record && record.audioURL ? (
          <AudioPlayer
            autoPlay={false}
            src={record.audioURL}
            autoPlayAfterSrcChange={false}
            onPlay={e => console.log('onPlay')}
          />
        ) : (
          <Typography variant='body1'>
            {t('MESSAGE_EMPTY_AUDIO_URL')}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Audio;
