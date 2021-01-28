import { dnnModel } from '../constants/training-constants';

const getTrainingStepNameByKey = (
  key: string,
  modelTrain: string = 'DNN'
): string => {
  if (modelTrain !== 'DNN') {
    return 'Unknown name';
  }

  const matched = dnnModel.steps.find(st => st.key === key)!;

  return matched.name;
};

export { getTrainingStepNameByKey };
