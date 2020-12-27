import { body } from 'express-validator';
import { googleDriverBaseURI } from '../configs/gg-driver/oAuth-config';

export const importAudioValidator = [
  body('shareLink')
    .trim()
    .notEmpty()
    .withMessage('Share link is required')
    .custom((value: string) => {
      if (!value.startsWith(googleDriverBaseURI)) {
        throw new Error('Share link is not valid');
      }

      return true;
    }),
];
