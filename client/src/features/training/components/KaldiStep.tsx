import React, { useState, useEffect } from 'react';

import BaseStepContent, { BaseStepContentType } from './BaseStepContent';
import { Progress } from 'app/api/trainingAPI';

interface Props {
  progresses: (Progress | null)[];
}

const KaldiStep: React.FC<Props> = ({ progresses }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [steps, setSteps] = useState<BaseStepContentType[]>([
    {
      index: 0,
      label: 'Prepare Text',
      content: 'Progress of Prepare Text step',
      isError: false,
      steps: [
        // {
        //   label: 'Prepare Text Step1',
        //   status: true,
        //   progress: 100,
        // },
        // {
        //   label: 'Prepare Text Step2',
        //   status: true,
        //   progress: 100,
        // },
        // {
        //   label: 'Prepare Text Step3',
        //   status: true,
        //   progress: 34,
        // },
      ],
    },
    {
      index: 1,
      label: 'Prepare Audio',
      content: 'Progress of Prepare Audio step',
      isError: false,
    },
    {
      index: 2,
      label: 'Align Phoneme Audio',
      content: 'Progress of Align PhoneEme step',
      isError: false,
      // errorMessage: 'Some thing went wrong',
    },
    {
      index: 3,
      label: 'Generate Output',
      content: 'Progress of Generate Output step',
      isError: false,
    },
  ]);

  useEffect(() => {
    if (progresses.length > 0) {
      setSteps(prevSteps => {
        return prevSteps.map(pvSt => {
          console.log(pvSt.label);
          const key = pvSt.label.toLowerCase().replaceAll(' ', '_');
          const match = progresses.find(p => p?.name.endsWith(key));

          if (match) {
            console.log({ key, match });
            return {
              ...pvSt,
              steps: match.steps.map(st => ({
                label: st.name,
                status: st.total === st.current,
                progress: st.percent,
              })),
              isError: match.current < match.total,
            };
          }

          return pvSt;
        });
      });

      setActiveStep(() => {
        return progresses.filter(p => p?.total === p?.current).length - 1;
      });
    }
  }, [progresses.length]);

  // console.log(progresses);
  // const progressesMarkup = progresses.map(p => {
  //   if (p?.name.endsWith('prepare_text')) {

  //   }
  // })

  return (
    <BaseStepContent
      steps={steps}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      setSteps={setSteps}
    />
  );
};

export default KaldiStep;
