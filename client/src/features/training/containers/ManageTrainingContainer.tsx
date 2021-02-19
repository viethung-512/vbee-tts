import React, { useState, useEffect, Fragment } from 'react';
import LoadingBar from 'react-top-loading-bar';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';

// import HeadsetIcon from '@material-ui/icons/Headset';
// import ReceiptIcon from '@material-ui/icons/Receipt';

import trainingAPI, { Progress } from 'app/api/trainingAPI';
import useAsync from 'hooks/useAsync';
import useModal from 'hooks/useModal';
import TrainingActionsForm from '../components/TrainingActionsForm';
import TrainingStep from '../components/TrainingStep';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
    padding: theme.spacing(2),
    borderRadius: 4,
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  iconContainer: {
    position: 'absolute',
    top: 0,
  },
  labelRoot: {
    position: 'relative',
  },
  labelContainer: {
    padding: theme.spacing(0, 4),
  },
}));

const ManageTrainingContainer: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [progresses, setProgresses] = useState<(Progress | null)[]>([]);
  const { openModal } = useModal();
  const [loading, setLoading] = useState(false);
  const { ref, startLoading, endLoading } = useAsync();
  const [curTrainingId, setCurTrainingId] = useState<string | null>(null);

  useEffect(() => {
    initPage();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let loop: any;
    if (curTrainingId) {
      loop = setInterval(() => {
        handleGetTrainingProgress(curTrainingId);
      }, 10 * 1000);
    } else {
      clearInterval(loop);
    }

    return () => {
      clearInterval(loop);
    };
  }, [curTrainingId]);

  useEffect(() => {
    if (progresses.length > 0 && progresses.some(p => p?.status === 'error')) {
      const errorProgress = progresses.find(p => p?.status === 'error')!;
      openModal('TrainingErrorModal', {
        message: `Error while progress ${errorProgress.name}`,
      });
      setCurTrainingId(null);
      setProgresses([]);
    }

    // eslint-disable-next-line
  }, [progresses]);

  const initPage = () => {
    startLoading();
    trainingAPI
      .checkCurrTraining()
      .then(({ isTraining, currTrainingId: curr }) => {
        if (isTraining) {
          setCurTrainingId(curr);
          return handleGetTrainingProgress(curr!);
        } else {
          setCurTrainingId(null);
        }
      })
      .then(() => {
        console.log('after fetch');
      })
      .catch(err => {
        console.log(err);
        console.log('some thing went wrong while init page');
      })
      .finally(() => {
        endLoading();
      });
  };

  const handleTraining = (
    paradigm: string,
    voice: string,
    corpora: string[]
  ) => {
    setLoading(true);

    trainingAPI
      .training(paradigm, voice, corpora)
      .then(cur => {
        console.log(cur);
        setCurTrainingId(cur);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetTrainingProgress = (id: string) => {
    trainingAPI
      .getTrainingProgress(id)
      .then(res => {
        const progressesResponse = res.progresses;
        progressesResponse.sort((a, b) => a!.stepUID - b!.stepUID);
        setActiveStep(
          progressesResponse[progressesResponse.length - 1]!.stepUID - 1
        );

        setProgresses(progressesResponse);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      <LoadingBar color={theme.palette.secondary.main} ref={ref} />
      {Boolean(curTrainingId) ? (
        <Grid container direction='column' className={classes.container}>
          <Grid item container alignItems='center'>
            {Boolean(curTrainingId) && (
              <Typography
                variant='body2'
                color='error'
                style={{ marginLeft: theme.spacing(2) }}
              >
                Tiến trình đang diễn ra...
              </Typography>
            )}
          </Grid>

          <Grid item container>
            <Stepper
              style={{ width: '100%' }}
              activeStep={activeStep}
              orientation='vertical'
            >
              {progresses.map((p, index) => {
                console.log({ p });
                return <TrainingStep />;
              })}
            </Stepper>
          </Grid>
        </Grid>
      ) : (
        <TrainingActionsForm
          handleTraining={handleTraining}
          loading={loading}
        />
      )}
    </Fragment>
  );
};

export default ManageTrainingContainer;
