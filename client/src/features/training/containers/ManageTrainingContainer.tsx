import React, { useState, useEffect, Fragment } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import HeadsetIcon from '@material-ui/icons/Headset';
import ReceiptIcon from '@material-ui/icons/Receipt';

import TrainingSteps, { TrainingStepType } from '../components/TrainingSteps';
import KaldiStep from '../components/KaldiStep';
import MerlinStep from '../components/MerlinStep';
import trainingAPI, { Progress } from 'app/api/trainingAPI';
import Button from 'app/layout/commons/form/Button';

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
}));

function getSteps(): TrainingStepType[] {
  return [
    {
      index: 0,
      label: 'Kaldi Training',
      icon: <HeadsetIcon />,
    },
    {
      index: 1,
      label: 'Merlin Training',
      icon: <ReceiptIcon />,
    },
  ];
}

const ManageTrainingContainer: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [progresses, setProgresses] = useState<(Progress | null)[]>([]);
  const steps = getSteps();
  const [loading, setLoading] = useState(false);

  const kaldiProgress = progresses
    .filter(p => p)
    .filter(p => p!.container === 'kaldi')
    .sort((a, b) => {
      // @ts-ignore
      return new Date(b?.start_time) - new Date(a?.start_time);
    });

  useEffect(() => {
    handleGetTrainingProgress();

    const loop = setInterval(() => {
      handleGetTrainingProgress();
    }, 10 * 1000);

    return () => {
      clearInterval(loop);
    };
  }, []);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return <KaldiStep progresses={kaldiProgress} />;
      case 1:
        return <MerlinStep />;
      default:
        return <KaldiStep progresses={kaldiProgress} />;
    }
  }

  const handleTraining = () => {
    setLoading(true);

    trainingAPI
      .training()
      .then(res => {
        console.log(res);
        return handleGetTrainingProgress();
      })
      .then(res => {
        setProgresses([]);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetTrainingProgress = () => {
    trainingAPI
      .getTrainingProgress()
      .then(res => {
        setProgresses(res.progresses);
      })
      .catch(err => {
        console.log(err);
      });
  };

  console.log(progresses);

  return (
    <Fragment>
      <Grid container direction='column' className={classes.container}>
        <Button
          loading={loading}
          content='Training'
          variant='primary'
          onClick={handleTraining}
        />
        <Grid item style={{ marginTop: theme.spacing(3) }}>
          <TrainingSteps steps={steps} activeStep={activeStep} />
        </Grid>
        <Grid item>
          <div>
            {getStepContent(activeStep)}
            {/* {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed - you&apos;re finished
              </Typography>
              <Button onClick={handleReset} className={classes.button}>
                Reset
              </Button>
            </div>
          ) : (
            <div>
              <div style={{ width: '100%' }}>{getStepContent(activeStep)}</div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )} */}
          </div>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ManageTrainingContainer;
