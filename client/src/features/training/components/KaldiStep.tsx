import React, { useState } from 'react';

import BaseStepContent, { BaseStepContentType } from './BaseStepContent';

const KaldiStep: React.FC = () => {
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
      label: 'Align PhoneEme Audio',
      content: 'Progress of Align PhoneEme step',
      isError: true,
      errorMessage: 'Some thing went wrong',
    },
    {
      index: 3,
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

export default KaldiStep;
