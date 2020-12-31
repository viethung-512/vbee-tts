export const getEnv = () => {
  if (!process.env.PORT) {
    throw new Error('PORT must me defined');
  }
  // if (!process.env.HOST) {
  //   throw new Error('HOST must be defined');
  // }
  // if (!process.env.PORT) {
  //   throw new Error('PORT must be defined');
  // }
  if (!process.env.STATIC_URL) {
    throw new Error('STATIC_URL must be defined');
  }

  return {
    port: process.env.PORT,
    // host: process.env.HOST,
    // port: parseInt(process.env.PORT),
    staticURL: process.env.STATIC_URL,
  };
};
