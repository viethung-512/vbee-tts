import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import HeadsetIcon from '@material-ui/icons/Headset';
import ReceiptIcon from '@material-ui/icons/Receipt';

import TrainingSteps, { TrainingStepType } from '../components/TrainingSteps';
import KaldiStep from '../components/KaldiStep';
import MerlinStep from '../components/MerlinStep';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
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

function getStepContent(stepIndex: number) {
  switch (stepIndex) {
    case 0:
      return <KaldiStep />;
    case 1:
      return <MerlinStep />;
    default:
      return <KaldiStep />;
  }
}

const ManageTrainingContainer: React.FC = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Grid container direction='column' className={classes.container}>
      <Grid item>
        <TrainingSteps steps={steps} activeStep={activeStep} />
      </Grid>
      <Grid item>
        <div>
          {activeStep === steps.length ? (
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
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default ManageTrainingContainer;
