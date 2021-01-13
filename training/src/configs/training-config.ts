import { Method } from 'axios';
import { getEnv } from './env-config';

const { training } = getEnv();

interface TrainingStep {
  name: string;
  url: string;
  method?: Method;
  description?: string;
}

interface TrainingParadigmStep extends TrainingStep {
  uid: number;
}

interface TrainingParadigm {
  name: string;
  steps: TrainingParadigmStep[];
  description?: string;
}

const trainingSteps: TrainingStep[] = [
  {
    name: 'Kaldi Prepare Text',
    description: '',
    url: `${training.host}:${training.port}/audio-labeling/prepare-text`,
    method: 'POST',
  },
  {
    name: 'Kaldi Prepare Audio',
    description: '',
    url: `${training.host}:${training.port}/audio-labeling/prepare-audio`,
    method: 'POST',
  },
  {
    name: 'Kaldi Align Phoneme Audio',
    description: '',
    url: `${training.host}:${training.port}/audio-labeling/align-phoneme-audio`,
    method: 'POST',
  },
  {
    name: 'Kaldi Generate Output',
    description: '',
    url: `${training.host}:${training.port}/audio-labeling/generate-output`,
    method: 'POST',
  },
  {
    name: 'Merlin Prepare Text',
    description: '',
    url: `${training.host}:${training.port}/voice-training/prepare-text`,
    method: 'POST',
  },
  {
    name: 'Merlin Prepare Audio',
    description: '',
    url: `${training.host}:${training.port}/voice-training/prepare-audio`,
    method: 'POST',
  },
  {
    name: 'Merlin Config Params',
    description: '',
    url: `${training.host}:${training.port}/voice-training/config-params`,
    method: 'POST',
  },
  {
    name: 'Merlin Extract Features',
    description: '',
    url: `${training.host}:${training.port}/voice-training/extract-features`,
    method: 'POST',
  },
  {
    name: 'Merlin Training Duration',
    description: '',
    url: `${training.host}:${training.port}/voice-training/train-duration`,
    method: 'POST',
  },
  {
    name: 'Merlin Train Acoustic',
    description: '',
    url: `${training.host}:${training.port}/voice-training/train-acoustic`,
    method: 'POST',
  },
  {
    name: 'Merlin Generate Output',
    description: '',
    url: `${training.host}:${training.port}/voice-training/generate-output`,
    method: 'POST',
  },
];

const DNNParadigm: TrainingParadigm = {
  name: 'DNN',
  steps: [
    {
      uid: 1,
      name: 'Kaldi Prepare Text',
      description: '',
      url: `${training.host}:${training.port}/audio-labeling/prepare-text`,
      method: 'POST',
    },
    {
      uid: 2,
      name: 'Kaldi Prepare Audio',
      description: '',
      url: `${training.host}:${training.port}/audio-labeling/prepare-audio`,
      method: 'POST',
    },
    {
      uid: 3,
      name: 'Kaldi Align Phoneme Audio',
      description: '',
      url: `${training.host}:${training.port}/audio-labeling/align-phoneme-audio`,
      method: 'POST',
    },
    {
      uid: 4,
      name: 'Kaldi Generate Output',
      description: '',
      url: `${training.host}:${training.port}/audio-labeling/generate-output`,
      method: 'POST',
    },
    {
      uid: 5,
      name: 'Merlin Prepare Text',
      description: '',
      url: `${training.host}:${training.port}/voice-training/prepare-text`,
      method: 'POST',
    },
    {
      uid: 6,
      name: 'Merlin Prepare Audio',
      description: '',
      url: `${training.host}:${training.port}/voice-training/prepare-audio`,
      method: 'POST',
    },
    {
      uid: 7,
      name: 'Merlin Config Params',
      description: '',
      url: `${training.host}:${training.port}/voice-training/config-params`,
      method: 'POST',
    },
    {
      uid: 8,
      name: 'Merlin Extract Features',
      description: '',
      url: `${training.host}:${training.port}/voice-training/extract-features`,
      method: 'POST',
    },
    {
      uid: 9,
      name: 'Merlin Training Duration',
      description: '',
      url: `${training.host}:${training.port}/voice-training/train-duration`,
      method: 'POST',
    },
    {
      uid: 10,
      name: 'Merlin Train Acoustic',
      description: '',
      url: `${training.host}:${training.port}/voice-training/train-acoustic`,
      method: 'POST',
    },
    {
      uid: 11,
      name: 'Merlin Generate Output',
      description: '',
      url: `${training.host}:${training.port}/voice-training/generate-output`,
      method: 'POST',
    },
  ],
  description: 'DNN Training Model',
};

export { trainingSteps, DNNParadigm };
