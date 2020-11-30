export const MONGO_URI = process.env.MONGO_URI!;
export const JWT_SECRET = process.env.JWT_SECRET!;

export const getEnv = () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must me defined');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined');
  }
  if (!process.env.ROOT_USER_USERNAME) {
    throw new Error('ROOT_USER_USERNAME must be defined');
  }
  if (!process.env.ROOT_USER_EMAIL) {
    throw new Error('ROOT_USER_EMAIL must be defined');
  }
  if (!process.env.ROOT_USER_PHONE_NUMBER) {
    throw new Error('ROOT_USER_PHONE_NUMBER must be defined');
  }
  if (!process.env.ROOT_USER_PASSWORD) {
    throw new Error('ROOT_USER_PASSWORD must be defined');
  }
  if (!process.env.STATIC_URL) {
    throw new Error('STATIC_URL must be defined');
  }

  return {
    mongo: {
      uri: process.env.MONGO_URI,
    },
    jwtSecret: process.env.JWT_SECRET,
    rootUser: {
      username: process.env.ROOT_USER_USERNAME,
      email: process.env.ROOT_USER_EMAIL,
      phoneNumber: process.env.ROOT_USER_PHONE_NUMBER,
      password: process.env.ROOT_USER_PASSWORD,
    },
    staticURL: process.env.STATIC_URL,
  };
};
