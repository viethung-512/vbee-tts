import { getEnv } from '../../configs/env-config';

const { queuePrefix } = getEnv();

const queueGroupName = `${queuePrefix}__data-service`;

export { queueGroupName };
