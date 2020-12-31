import { BadRequestError, DialectType } from '@tts-dev/common';
import { Request, Response } from 'express';
import { allophoneService } from '../services/allophone-service';

const getPronunciationAndAddAllophoneContent = async (
  req: Request,
  res: Response
) => {
  const { text, dialect } = req.query;
  const {
    success,
    errors,
    pronunciation,
    allophoneContent,
  } = await allophoneService.getPronunciationAndAllophoneContent({
    text: text!.toString(),
    dialect: dialect!.toString() as DialectType,
    voice:
      dialect!.toString() === DialectType.HANOI
        ? 'voice-vbee-tts-voice-hn_male_manhdung_news_48k-h'
        : 'vbee-tts-voice-sg_male_minhhoang_news_48k-h',
  });

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.send({ pronunciation, allophoneContent });
};

const allophoneController = { getPronunciationAndAddAllophoneContent };

export { allophoneController };
