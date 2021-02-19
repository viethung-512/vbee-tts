export const MONGO_URI = process.env.MONGO_URI!;
export const JWT_SECRET = process.env.JWT_SECRET!;

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

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined');
  }
  if (!process.env.STATIC_URL) {
    throw new Error('STATIC_URL must be defined');
  }
  if (!process.env.STATIC_HOST) {
    throw new Error('STATIC_HOST must be defined');
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
  if (!process.env.QUEUE_GROUP_PREFIX) {
    throw new Error('QUEUE_GROUP_PREFIX must be defined');
  }

  const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

  return {
    port: process.env.PORT,
    mongo: {
      uri: mongoURI,
    },
    jwtSecret: process.env.JWT_SECRET,
    staticURL: process.env.STATIC_URL,
    staticHost: process.env.STATIC_HOST,
    nats: {
      clusterId: process.env.NATS_CLUSTER_ID,
      clientId: process.env.NATS_CLIENT_ID,
      url: process.env.NATS_URL,
    },
    queuePrefix: process.env.QUEUE_GROUP_PREFIX,
  };
};
