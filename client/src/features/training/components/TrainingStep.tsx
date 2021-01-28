import React from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Stepper from '@material-ui/core/Stepper';

import DoneIcon from '@material-ui/icons/Done';

import CircularProgressWithLabel from 'app/layout/commons/async/CircularProgressWithLabel';

const useStyles = makeStyles(theme => ({
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
  successIcon: {
    color: theme.palette.success.main,
  },
}));

const TrainingStep = () => {
  const classes = useStyles();
  const theme = useTheme();

  const childSteps = [
    {
      name: 'child step name',
      percent: 59,
    },
  ];

  return (
    <Stepper style={{ width: '100%' }} activeStep={1} orientation='vertical'>
      <Step>
        <StepLabel
          classes={{
            iconContainer: classes.iconContainer,
            root: classes.labelRoot,
            labelContainer: classes.labelContainer,
          }}
        >
          <Grid container direction='column'>
            <Grid item container>
              Step name (100%)
            </Grid>
          </Grid>
        </StepLabel>
        {childSteps && childSteps.length > 0 && (
          <Grid item container style={{ marginTop: theme.spacing(2) }}>
            {childSteps.map((st, index) => {
              console.log({ st });
              return (
                <Grid item container key={`${st.name}-${index}`}>
                  <Grid item xs={1}>
                    {st.percent && st.percent === 100 ? (
                      <DoneIcon className={classes.successIcon} />
                    ) : (
                      <CircularProgressWithLabel value={st.percent!} />
                    )}
                  </Grid>
                  <Grid item xs={11}>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      gutterBottom={false}
                    >
                      {st.name}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        )}
        <StepContent>step content</StepContent>
      </Step>
    </Stepper>
  );
};

export default TrainingStep;
