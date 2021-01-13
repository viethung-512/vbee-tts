import { Client } from 'elasticsearch';
import { getEnv } from '../configs/env-config';

const { elasticsearch } = getEnv();

const client = new Client({
  host: elasticsearch.uri,
  log: 'trace',
  apiVersion: '7.2',
});

export default client;
