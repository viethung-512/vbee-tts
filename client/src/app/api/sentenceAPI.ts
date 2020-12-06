// import axiosClient from './axiosClient';

// const importSentences = async (ids: string[]): Promise<Sentence> => {

// }

const getSampleImportFileURL = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('this is sample link');
    }, 1000);
  });
};

const sentenceAPI = { getSampleImportFileURL };

export default sentenceAPI;
