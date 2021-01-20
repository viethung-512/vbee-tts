interface TrainingStep {
  index: number;
  key: string;
  icon: string;
  name: string;
}

interface Paradigm {
  name: string;
  key: string;
}

interface Voice {
  name: string;
  key: string;
}

interface Corpus {
  name: string;
  key: string;
}

export const dnnParadigm: TrainingStep[] = [
  {
    index: 1,
    key: 'kaldi',
    name: 'Kaldi Training',
    icon: '',
  },
  {
    index: 2,
    key: 'merlin',
    name: 'Merlin Training',
    icon: '',
  },
];

export const listParadigms: Paradigm[] = [
  {
    name: 'DNN Training',
    key: 'DNN',
  },
];

export const listVoices: Voice[] = [
  {
    name: 'hue_male_duyphuong',
    key: 'hue_male_duyphuong',
  },
  {
    name: 'hue_female_huonggiang',
    key: 'hue_female_huonggiang',
  },
  {
    name: 'sg_male_minhhoang',
    key: 'sg_male_minhhoang',
  },
  {
    name: 'sg_female_thaotrinh',
    key: 'sg_female_thaotrinh',
  },
  {
    name: 'hn_female_maiphuong',
    key: 'hn_female_maiphuong',
  },
  {
    name: 'hn_male_manhdung',
    key: 'hn_male_manhdung',
  },
  {
    name: 'hn_female_ngochuyen',
    key: 'hn_female_ngochuyen',
  },
  {
    name: 'hn_female_test',
    key: 'hn_female_test',
  },
];

export const listCorpora: Corpus[] = [
  { name: 'CALS', key: 'cals' },
  { name: 'DIAL', key: 'dial' },
  { name: 'NEWS', key: 'news' },
  { name: 'STORS', key: 'stors' },
  { name: 'BOOK', key: 'book' },
];
