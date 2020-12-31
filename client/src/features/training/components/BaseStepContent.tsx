import React from 'react';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  })
);

export interface BaseStepContentType {
  index: number;
  label: string;
  content: string;
  isError: boolean;
  errorMessage?: string;
}

interface Props {
  steps: BaseStepContentType[];
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setSteps: React.Dispatch<React.SetStateAction<BaseStepContentType[]>>;
}

const BaseStepContent: React.FC<Props> = ({
  steps,
  activeStep,
  setActiveStep,
  setSteps,
}) => {
  const classes = useStyles();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleFixBug = (stepIndex: number) => {
    setSteps(prevSteps => {
      return prevSteps.map(step => {
        if (step.index === stepIndex) {
          return {
            ...step,
            isError: false,
          };
        }

        return step;
      });
    });
  };

  const handleTraining = (isError: boolean, stepIndex: number) => {
    if (isError) {
      handleFixBug(stepIndex);
    } else {
      handleNext();
    }
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation='vertical'>
        {steps.map(({ index, isError, errorMessage, label, content }) => (
          <Step key={content}>
            <StepLabel error={isError}>{label}</StepLabel>
            <StepContent>
              {isError ? (
                <Typography color='error'>{errorMessage}</Typography>
              ) : (
                <Typography>{content}</Typography>
              )}

              <div className={classes.actionsContainer}>
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
                    onClick={() => handleTraining(isError, index)}
                    className={classes.button}
                  >
                    {isError
                      ? 'Fix Bug'
                      : activeStep === steps.length - 1
                      ? 'Finish'
                      : 'Start Training'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default BaseStepContent;