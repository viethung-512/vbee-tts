import { DialectType } from '@tts-dev/common';
import { query } from 'express-validator';
// import { defaultVoices } from '../constants/voice-constant'

export const getAllophoneValidator = [
  query('text').trim().notEmpty().withMessage('Text is required'),
  // query('voice').custom(value => {
  //   const valid = defaultVoices.map(voice => voice.code).includes(value);

  //   if (!valid) {
  //     throw new Error('Voice is not valid')
  //   }

  //   return true;
  // }),
  query('dialect').custom(value => {
    if (!Object.values(DialectType).includes(value)) {
      throw new Error('Dialect is not valid');
    }
    return true;
  }),
];
