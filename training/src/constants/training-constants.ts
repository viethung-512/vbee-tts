import { ModelTrain } from '@tts-dev/common';

const dnnModel: ModelTrain = {
  name: 'DNN',
  steps: [
    {
      index: 1,
      name: 'Kaldi Prepare Text',
      description: 'Kaldi Prepare Text',
      url: 'audio-labeling/prepare-text',
      key: 'ser13_prepare_text',
    },
    {
      index: 2,
      name: 'Kaldi Prepare Audio',
      description: 'Kaldi Prepare Audio',
      url: 'audio-labeling/prepare-audio',
      key: 'ser14_prepare_audio',
    },
    {
      index: 3,
      name: 'Kaldi Align Phoneme Audio',
      description: 'Kaldi Align Phoneme Audio',
      url: 'audio-labeling/align-phoneme-audio',
      key: 'ser15_align_phoneme_audio',
    },
    {
      index: 4,
      name: 'Kaldi Generate Output',
      description: 'Kaldi Generate Output',
      url: 'audio-labeling/generate-output',
      key: 'ser16_generate_output',
    },
    {
      index: 5,
      name: 'Merlin Prepare Text',
      description: 'Merlin Prepare Text',
      url: 'voice-training/prepare-text',
      key: 'ser22_prepare_text',
    },
    {
      index: 6,
      name: 'Merlin Prepare Audio',
      description: 'Merlin Prepare Audio',
      url: 'voice-training/prepare-audio',
      key: 'ser23_prepare_audio',
    },
    {
      index: 7,
      name: 'Merlin Config Params',
      description: 'Merlin Config Params',
      url: 'voice-training/config-params',
      key: 'ser24_config_params',
    },
    {
      index: 8,
      name: 'Merlin Extract Features',
      description: 'Merlin Extract Features',
      url: 'voice-training/extract-features',
      key: 'ser25_extract_features',
    },
    {
      index: 9,
      name: 'Merlin Training Duration',
      description: 'Merlin Training Duration',
      url: 'voice-training/train-duration',
      key: 'ser26_train_duration',
    },
    {
      index: 10,
      name: 'Merlin Train Acoustic',
      description: 'Merlin Train Acoustic',
      url: 'voice-training/train-acoustic',
      key: 'ser27_train_acoustic',
    },
    {
      index: 11,
      name: 'Merlin Generate Output',
      description: 'Merlin Generate Output',
      url: 'voice-training/generate-output',
      key: 'ser28_generate_output',
    },
  ],
  descriptions: 'DNN Training Model',
};

export { dnnModel };
