import React, { useState } from 'react';

import BaseStepContent, { BaseStepContentType } from './BaseStepContent';

const MerlinStep: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [steps, setSteps] = useState<BaseStepContentType[]>([
    {
      index: 0,
      label: 'Prepare Text',
      content: 'Progress of Prepare Text step',
      isError: false,
    },
    {
      index: 1,
      label: 'Prepare Audio',
      content: 'Progress of Prepare Audio step',
      isError: false,
    },
    {
      index: 2,
      label: 'Config Params',
      content: 'Progress of Config Params step',
      isError: false,
    },
    {
      index: 3,
      label: 'Extract Features',
      content: 'Progress of Extract Features step',
      isError: false,
    },
    {
      index: 4,
      label: 'Train Duration',
      content: 'Progress of Train Duration step',
      isError: true,
      errorMessage: 'Some thing went wrong',
    },
    {
      index: 5,
      label: 'Train Acoustic',
      content: 'Progress of Train Acoustic step',
      isError: false,
    },
    {
      index: 6,
      label: 'Generate Output',
      content: 'Progress of Generate Output step',
      isError: false,
    },
  ]);

  return (
    <BaseStepContent
      steps={steps}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      setSteps={setSteps}
    />
  );
};

export default MerlinStep;
