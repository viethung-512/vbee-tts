import * as yup from 'yup';
import { validatorMessages } from './constants';
import { minPassword } from './config';

const {
  REQUIRED_EXISTS,
  REQUIRED_VALID_EMAIL,
  REQUIRED_VALID_PHONE_NUMBER,
  REQUIRED_MATCH_PASSWORD,
  REQUIRED_PASSWORD_MIN,
} = validatorMessages;

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const loginValidator = yup.object().shape({
  phoneNumber: yup
    .string()
    .required(REQUIRED_EXISTS)
    .matches(phoneRegExp, REQUIRED_VALID_PHONE_NUMBER),
  password: yup.string().required(REQUIRED_EXISTS),
});

export const getUserActionValidator = (userId?: string) => {
  if (userId) {
    return yup.object().shape({
      username: yup.string().required(REQUIRED_EXISTS),
      role: yup.object().shape({
        id: yup.string().required(REQUIRED_EXISTS),
      }),
      email: yup.string().required(REQUIRED_EXISTS).email(REQUIRED_VALID_EMAIL),
      phoneNumber: yup
        .string()
        .required(REQUIRED_EXISTS)
        .matches(phoneRegExp, REQUIRED_VALID_PHONE_NUMBER),
    });
  }

  return yup.object().shape({
    username: yup.string().required(REQUIRED_EXISTS),
    role: yup.object().shape({
      id: yup.string().required(REQUIRED_EXISTS),
    }),
    email: yup.string().required(REQUIRED_EXISTS).email(REQUIRED_VALID_EMAIL),
    phoneNumber: yup
      .string()
      .required(REQUIRED_EXISTS)
      .matches(phoneRegExp, REQUIRED_VALID_PHONE_NUMBER),
    password: yup
      .string()
      .required(REQUIRED_EXISTS)
      .min(minPassword, REQUIRED_PASSWORD_MIN),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], REQUIRED_MATCH_PASSWORD),
  });
};

export const userUpdateProfileValidator = yup.object().shape({
  username: yup.string().required(REQUIRED_EXISTS),
});

export const updatePasswordValidator = yup.object().shape({
  oldPassword: yup.string().required(REQUIRED_EXISTS),
  newPassword: yup.string().required(REQUIRED_EXISTS),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], REQUIRED_MATCH_PASSWORD),
});

export const createRoleValidator = yup.object().shape({
  name: yup.string().required(REQUIRED_EXISTS),
});

export const updateSentenceValidator = yup.object().shape({
  original: yup.string().required(REQUIRED_EXISTS),
  dialectHN: yup.string().required(REQUIRED_EXISTS),
});

export const updateRecordValidator = yup.object().shape({
  original: yup.string().required(REQUIRED_EXISTS),
  dialect: yup.string().required(REQUIRED_EXISTS),
});

export const submitErrorSentenceValidator = yup.object().shape({
  errorMessage: yup.string().required(REQUIRED_EXISTS),
});

export const submitErrorBroadcasterSentenceValidator = yup.object().shape({
  errorMessage: yup.string().required(REQUIRED_EXISTS),
});

export const createVoiceValidator = yup.object().shape({
  name: yup.string().required(REQUIRED_EXISTS),
});

export const createBroadcasterValidator = yup.object().shape({
  types: yup
    .array()
    .required()
    .min(1, 'Please choose at least 1 type')
    .of(
      yup.object().shape({
        label: yup.string(),
        value: yup.string(),
      })
    )

    .required(REQUIRED_EXISTS),
  user: yup.object().shape({
    id: yup.string().required(REQUIRED_EXISTS),
  }),
  voice: yup.object().shape({
    id: yup.string().required(REQUIRED_EXISTS),
  }),
  dialect: yup.string().required(REQUIRED_EXISTS),
  expiredAt: yup.string().required(REQUIRED_EXISTS),
});

export const importAudioValidator = yup.object().shape({
  shareLink: yup.string().required(REQUIRED_EXISTS),
});

export const editRecordValidator = yup.object().shape({
  original: yup.string().required(REQUIRED_EXISTS),
  dialect: yup.string().required(REQUIRED_EXISTS),
});

export const submitErrorRecordValidator = yup.object().shape({
  errorMessage: yup.string().required(REQUIRED_EXISTS),
});
