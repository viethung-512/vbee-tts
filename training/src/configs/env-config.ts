export const getEnv = () => {
  if (!process.env.PORT) {
    throw new Error('PORT must me defined');
  }

  if (!process.env.MONGO_HOST) {
    throw new Error('MONGO_HOST must me defined');
  }
  if (!process.env.MONGO_PORT) {
    throw new Error('MONGO_PORT must me defined');
  }
  if (!process.env.MONGO_DATABASE) {
    throw new Error('MONGO_DATABASE must me defined');
  }
  if (!process.env.MONGO_USERNAME) {
    throw new Error('MONGO_USERNAME must me defined');
  }
  if (!process.env.MONGO_PASSWORD) {
    throw new Error('MONGO_PASSWORD must me defined');
  }

  if (!process.env.ELASTICSEARCH_HOST) {
    throw new Error('ELASTICSEARCH_HOST must me defined');
  }
  if (!process.env.ELASTICSEARCH_PORT) {
    throw new Error('ELASTICSEARCH_PORT must me defined');
  }
  if (!process.env.ELASTICSEARCH_INDEX) {
    throw new Error('ELASTICSEARCH_INDEX must me defined');
  }

  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST must be defined');
  }
  if (!process.env.REDIS_PORT) {
    throw new Error('REDIS_PORT must be defined');
  }
  if (!process.env.REDIS_PASSWORD) {
    throw new Error('REDIS_PASSWORD must be defined');
  }

  if (!process.env.TRAINING_HOST) {
    throw new Error('TRAINING_HOST must me defined');
  }
  if (!process.env.TRAINING_PORT) {
    throw new Error('TRAINING_PORT must me defined');
  }

  if (!process.env.STATIC_URL) {
    throw new Error('STATIC_URL must be defined');
  }
  if (!process.env.STATIC_HOST) {
    throw new Error('STATIC_HOST must be defined');
  }
  if (!process.env.HOST_URL) {
    throw new Error('HOST_URL must be defined');
  }

  const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
  const elasticsearchURI = `${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`;
  const trainingURI = `${process.env.TRAINING_HOST}:${process.env.TRAINING_PORT}`;

  return {
    port: process.env.PORT,
    mongo: {
      uri: mongoURI,
    },
    elasticsearch: {
      uri: elasticsearchURI,
      index: process.env.ELASTICSEARCH_INDEX,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    },
    staticURL: process.env.STATIC_URL,
    staticHost: process.env.STATIC_HOST,
    hostURL: process.env.HOST_URL,
    queuePrefix: process.env.QUEUE_GROUP_PREFIX,
    training: {
      uri: trainingURI,
    },
  };
};
