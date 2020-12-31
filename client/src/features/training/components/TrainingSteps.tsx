import React from 'react';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';

import { StepIconProps } from '@material-ui/core/StepIcon';

export interface TrainingStepType {
  index: number;
  label: string;
  icon: JSX.Element;
}

interface Props {
  steps: TrainingStepType[];
  activeStep: number;
}

const useStyles = makeStyles({
  iconRoot: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconActive: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  iconCompleted: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  },
});

const ColorLibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const TrainingSteps: React.FC<Props> = ({ steps, activeStep }) => {
  const classes = useStyles();

  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<ColorLibConnector />}
    >
      {steps.map(({ label, index, icon }) => (
        <Step key={index}>
          <StepLabel
            StepIconComponent={({ active, completed }: StepIconProps) => (
              <div
                className={clsx(classes.iconRoot, {
                  [classes.iconActive]: active,
                  [classes.iconCompleted]: completed,
                })}
              >
                {icon}
              </div>
            )}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default TrainingSteps;
