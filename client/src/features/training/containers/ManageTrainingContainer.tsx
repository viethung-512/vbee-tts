import React, { useState, useEffect, Fragment } from 'react';
import LoadingBar from 'react-top-loading-bar';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import HeadsetIcon from '@material-ui/icons/Headset';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

import DoneIcon from '@material-ui/icons/Done';

import TrainingSteps, { TrainingStepType } from '../components/TrainingSteps';
import KaldiStep from '../components/KaldiStep';
import MerlinStep from '../components/MerlinStep';
import trainingAPI, { Progress } from 'app/api/trainingAPI';
import Button from 'app/layout/commons/form/Button';
import useAsync from 'hooks/useAsync';
import useModal from 'hooks/useModal';
import TrainingActionsForm from '../components/TrainingActionsForm';
import CircularProgressWithLabel from 'app/layout/commons/async/CircularProgressWithLabel';

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
  const { openModal } = useModal();
  const [loading, setLoading] = useState(false);
  const { ref, startLoading, endLoading } = useAsync();
  const [curTrainingId, setCurTrainingId] = useState<string | null>(null);

  const kaldiProgress = progresses
    .filter(p => p)
    .filter(p => p!.container === 'kaldi')
    .sort((a, b) => {
      // @ts-ignore
      return new Date(b?.start_time) - new Date(a?.start_time);
    });

  useEffect(() => {
    initPage();
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
  }, [progresses]);

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
    console.log({ paradigm, voice, corpora });
    setLoading(true);

    trainingAPI
      .training(paradigm, voice, corpora)
      .then(cur => {
        console.log(cur);
        setCurTrainingId(cur);
        // return handleGetTrainingProgress();
      })
      // .then(res => {
      //   setProgresses([]);
      // })
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
        console.log({ progressesResponse });
        console.log(
          progressesResponse[progressesResponse.length - 1]!.stepUID - 1
        );
        setActiveStep(
          progressesResponse[progressesResponse.length - 1]!.stepUID - 1
        );

        setProgresses(progressesResponse);
      })
      .catch(err => {
        console.log(err);
      });
  };

  console.log(progresses.filter(p => p?.container === 'kaldi'));

  return (
    <Fragment>
      <LoadingBar color={theme.palette.secondary.main} ref={ref} />
      {Boolean(curTrainingId) ? (
        <Grid container direction='column' className={classes.container}>
          <Grid item container alignItems='center'>
            {/* <Button
              loading={loading}
              content='Bắt đầu huấn luyện'
              variant='primary'
              onClick={handleTraining}
              disabled={Boolean(curTrainingId)}
            /> */}
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

          {/* <Grid item style={{ marginTop: theme.spacing(3) }}>
            <TrainingSteps steps={steps} activeStep={activeStep} />
          </Grid>
          <Grid item>
            <div>{getStepContent(activeStep)}</div>
          </Grid> */}
          <Grid item container>
            <Stepper
              style={{ width: '100%' }}
              activeStep={activeStep}
              orientation='vertical'
            >
              {progresses.map((p, index) => {
                console.log({ p });
                return (
                  <Step key={`${p?.name}_${index}`}>
                    <StepLabel
                      classes={{
                        iconContainer: classes.iconContainer,
                        root: classes.labelRoot,
                        labelContainer: classes.labelContainer,
                      }}
                    >
                      <Grid container direction='column'>
                        <Grid item container>
                          {p?.name} ({p?.percent})
                        </Grid>
                        {p?.steps && p.steps.length > 0 && (
                          <Grid
                            item
                            container
                            style={{ marginTop: theme.spacing(2) }}
                          >
                            {p.steps.map((st, index) => {
                              console.log({ st });
                              return (
                                <Grid
                                  item
                                  container
                                  key={`${st.name}-${index}`}
                                >
                                  <Grid item xs={1}>
                                    {st.percent && st.percent === 100 ? (
                                      <DoneIcon
                                        style={{
                                          color: theme.palette.success.main,
                                        }}
                                      />
                                    ) : (
                                      <CircularProgressWithLabel
                                        value={st.percent!}
                                      />
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
                      </Grid>
                    </StepLabel>
                    <StepContent>
                      {/* {p?.percent === 100 ? (
                        <Typography variant='body2'>{p?.name}</Typography>
                      ) : (
                        <Typography variant='body2' color='error'>
                          Loading...
                        </Typography>
                      )} */}
                      {/* <div className={classes.actionsContainer}>
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
                  </div> */}
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>
          </Grid>
        </Grid>
      ) : (
        <TrainingActionsForm handleTraining={handleTraining} />
      )}
    </Fragment>
  );
};

export default ManageTrainingContainer;
