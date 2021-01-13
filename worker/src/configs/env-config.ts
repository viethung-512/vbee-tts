export const getEnv = () => {
  if (!process.env.PORT) {
    throw new Error('PORT must me defined');
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

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
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
  if (!process.env.QUEUE_GROUP_PREFIX) {
    throw new Error('QUEUE_GROUP_PREFIX must be defined');
  }

  return {
    port: process.env.PORT,
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    },
    staticURL: process.env.STATIC_URL,
    nats: {
      clusterId: process.env.NATS_CLUSTER_ID,
      clientId: process.env.NATS_CLIENT_ID,
      url: process.env.NATS_URL,
    },
    hostURL: process.env.HOST_URL,
    staticHost: process.env.STATIC_HOST,
    queuePrefix: process.env.QUEUE_GROUP_PREFIX,
  };
};
