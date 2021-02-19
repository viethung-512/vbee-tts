import { minPassword } from '../utils/config';

export const validatorMessages = {
  REQUIRED_EXISTS: 'Must not be empty.',
  REQUIRED_VALID_EMAIL: 'Must be a valid email address.',
  REQUIRED_VALID_PHONE_NUMBER: 'Must be a valid phone number.',
  REQUIRED_MATCH_PASSWORD: 'Password must matches.',
  REQUIRED_PASSWORD_MIN: `Password must at least ${minPassword} characters.`,
};
