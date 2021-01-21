export interface TrainingStep {
  index: number;
  name: string;
  key: string;
  url: string;
  description?: string;
}

export interface ModelTrain {
  name: string;
  steps: TrainingStep[];
  descriptions?: string;
}
