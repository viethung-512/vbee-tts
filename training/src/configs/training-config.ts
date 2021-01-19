import { Method } from 'axios';
import { getEnv } from './env-config';

const { training } = getEnv();

// const trainingURL = training.uri;
const trainingURL = training.localURI;

interface TrainingStep {
  name: string;
  url: string;
  paramFields: string[];
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
    description: 'Kaldi Prepare Text',
    url: `${trainingURL}/audio-labeling/prepare-text`,
    paramFields: ['voice', 'corpora', 'training_id', 'train_ratio'],
  },
  {
    name: 'Kaldi Prepare Audio',
    description: '',
    url: `${trainingURL}/audio-labeling/prepare-audio`,
    paramFields: ['voice', 'corpora', 'training_id'],
  },
  {
    name: 'Kaldi Align Phoneme Audio',
    description: 'Kaldi Prepare Audio',
    url: `${trainingURL}/audio-labeling/align-phoneme-audio`,
    paramFields: ['voice', 'corpora', 'training_id'],
  },
  {
    name: 'Kaldi Generate Output',
    description: 'Kaldi Generate Output',
    url: `${trainingURL}/audio-labeling/generate-output`,
    paramFields: ['voice', 'corpora', 'training_id'],
  },
  {
    name: 'Merlin Prepare Text',
    description: 'Merlin Prepare Text',
    url: `${trainingURL}/voice-training/prepare-text`,
    paramFields: ['voice', 'corpora', 'training_id'],
  },
  {
    name: 'Merlin Prepare Audio',
    description: 'Merlin Prepare Audio',
    url: `${trainingURL}/voice-training/prepare-audio`,
    paramFields: ['voice', 'corpora', 'training_id'],
  },
  {
    name: 'Merlin Config Params',
    description: 'Merlin Config Params',
    url: `${trainingURL}/voice-training/config-params`,
    paramFields: ['voice', 'corpora', 'training_id'],
  },
  {
    name: 'Merlin Extract Features',
    description: 'Merlin Extract Features',
    url: `${trainingURL}/voice-training/extract-features`,
    paramFields: ['voice', 'corpora', 'training_id'],
  },
  {
    name: 'Merlin Training Duration',
    description: 'Merlin Training Duration',
    url: `${trainingURL}/voice-training/train-duration`,
    paramFields: ['voice', 'corpora', 'training_id'],
  },
  {
    name: 'Merlin Train Acoustic',
    description: '',
    url: `${trainingURL}/voice-training/train-acoustic`,
    paramFields: ['voice', 'corpora', 'training_id'],
  },
  {
    name: 'Merlin Generate Output',
    description: 'Merlin Train Acoustic',
    url: `${trainingURL}/voice-training/generate-output`,
    paramFields: ['voice', 'corpora', 'training_id'],
  },
];

const DNNParadigm: TrainingParadigm = {
  name: 'DNN',
  steps: [
    {
      uid: 1,
      name: 'Kaldi Prepare Text',
      description: 'Kaldi Prepare Text',
      url: `${trainingURL}/audio-labeling/prepare-text`,
      paramFields: ['voice', 'corpora', 'training_id'],
    },
    {
      uid: 2,
      name: 'Kaldi Prepare Audio',
      description: 'Kaldi Prepare Audio',
      url: `${trainingURL}/audio-labeling/prepare-audio`,
      paramFields: ['voice', 'corpora', 'training_id'],
    },
    {
      uid: 3,
      name: 'Kaldi Align Phoneme Audio',
      description: 'Kaldi Align Phoneme Audio',
      url: `${trainingURL}/audio-labeling/align-phoneme-audio`,
      paramFields: ['voice', 'corpora', 'training_id'],
    },
    {
      uid: 4,
      name: 'Kaldi Generate Output',
      description: 'Kaldi Generate Output',
      url: `${trainingURL}/audio-labeling/generate-output`,
      paramFields: ['voice', 'corpora', 'training_id'],
    },
    {
      uid: 5,
      name: 'Merlin Prepare Text',
      description: 'Merlin Prepare Text',
      url: `${trainingURL}/voice-training/prepare-text`,
      paramFields: ['voice', 'corpora', 'training_id'],
    },
    {
      uid: 6,
      name: 'Merlin Prepare Audio',
      description: 'Merlin Prepare Audio',
      url: `${trainingURL}/voice-training/prepare-audio`,
      paramFields: ['voice', 'corpora', 'training_id'],
    },
    {
      uid: 7,
      name: 'Merlin Config Params',
      description: 'Merlin Config Params',
      url: `${trainingURL}/voice-training/config-params`,
      paramFields: ['voice', 'corpora', 'training_id'],
    },
    {
      uid: 8,
      name: 'Merlin Extract Features',
      description: 'Merlin Extract Features',
      url: `${trainingURL}/voice-training/extract-features`,
      paramFields: ['voice', 'corpora', 'training_id'],
    },
    {
      uid: 9,
      name: 'Merlin Training Duration',
      description: 'Merlin Training Duration',
      url: `${trainingURL}/voice-training/train-duration`,
      paramFields: ['voice', 'corpora', 'training_id'],
    },
    {
      uid: 10,
      name: 'Merlin Train Acoustic',
      description: 'Merlin Train Acoustic',
      url: `${trainingURL}/voice-training/train-acoustic`,
      paramFields: ['voice', 'corpora', 'training_id'],
    },
    {
      uid: 11,
      name: 'Merlin Generate Output',
      description: 'Merlin Generate Output',
      url: `${trainingURL}/voice-training/generate-output`,
      paramFields: ['voice', 'corpora', 'training_id'],
    },
  ],
  description: 'DNN Training Model',
};

export { trainingSteps, DNNParadigm };
