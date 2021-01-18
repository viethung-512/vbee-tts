import { Client } from 'elasticsearch';
import { getEnv } from '../configs/env-config';
import axios from 'axios';

const { elasticsearch } = getEnv();

const client = new Client({
  host: elasticsearch.uri,
  log: 'trace',
  apiVersion: '7.2',
});

export const initIndex = async () => {
  try {
    await axios.head(`${elasticsearch.uri}/${elasticsearch.index}`);

    console.log('You ready to go with elk.');
  } catch (error) {
    if (error.response.status === 404) {
      await axios.put(`${elasticsearch.uri}/${elasticsearch.index}`);
      console.log(`Create index successful ${elasticsearch.index}`);
    }
  }
};

export default client;
