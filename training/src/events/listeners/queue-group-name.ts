import { getEnv } from '../../configs/env-config';

const { queuePrefix } = getEnv();

const queueGroupName = `${queuePrefix}__training-service`;

export { queueGroupName };
