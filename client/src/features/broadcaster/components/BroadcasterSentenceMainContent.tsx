import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { formatUID } from 'app/utils/helper';

interface Props {
  loading: boolean;
  completed: boolean;
  originalImage?: string;
  dialectImage?: string;
  uid: number;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
  },
  itemContainer: {
    padding: theme.spacing(2),
  },
  tagCompleted: {
    backgroundColor: theme.palette.success.main,
    color: '#fff',
  },
  tagNotComplete: {
    backgroundColor: theme.palette.error.main,
    color: '#fff',
  },
}));

const BroadcasterSentenceMainContent: React.FC<Props> = ({
  loading,
  completed,
  originalImage,
  dialectImage,
  uid,
}) => {
  const { t }: { t: any } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        justify='space-between'
        alignItems='center'
        className={classes.itemContainer}
      >
        <Grid item>
          {loading ? (
            <Skeleton variant='text' width={64} animation='wave' />
          ) : (
            <Chip
              size='small'
              label={formatUID(uid)}
              variant='outlined'
              color='secondary'
            />
          )}
        </Grid>

        <Grid item>
          {loading ? (
            <Skeleton variant='text' width={64} animation='wave' />
          ) : (
            <Chip
              size='small'
              label={
                completed ? t('STATUS_COMPLETED') : t('STATUS_NOT_COMPLETED')
              }
              className={
                completed ? classes.tagCompleted : classes.tagNotComplete
              }
            />
          )}
        </Grid>
      </Grid>

      <Grid container direction='column' className={classes.itemContainer}>
        <Grid item container direction='column'>
          <Grid item>
            <Typography variant='body1' color='textSecondary' gutterBottom>
              {t('TITLE_ORIGINAL_SENTENCE')}
            </Typography>
          </Grid>
          <Grid item container justify='center'>
            {loading ? (
              <Skeleton
                variant='rect'
                width='100%'
                height={64}
                animation='wave'
              />
            ) : (
              <img
                alt='dialect'
                src={originalImage}
                style={{ width: '100%' }}
              />
            )}
          </Grid>
        </Grid>

        <Grid item container direction='column'>
          <Grid item>
            <Typography variant='body1' color='textSecondary' gutterBottom>
              {t('TITLE_PRONUNCIATION')}
            </Typography>
          </Grid>
          <Grid item container justify='center'>
            {loading ? (
              <Skeleton
                variant='rect'
                width='100%'
                height={64}
                animation='wave'
              />
            ) : (
              <img alt='dialect' src={dialectImage} style={{ width: '100%' }} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default BroadcasterSentenceMainContent;
