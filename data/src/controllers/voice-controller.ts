import { BadRequestError } from '@tts-dev/common';
import { Request, Response } from 'express';
import {} from '../models/voice';
import { voiceService } from '../services/voice-service';

const getVoices = async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;
  const { success, errors, paginatedVoices } = await voiceService.getVoices({
    search: search?.toString(),
    page: page ? parseInt(page.toString()) : undefined,
    limit: limit ? parseInt(limit.toString()) : undefined,
  });

  if (!success) {
    throw new BadRequestError('Bad Request', errors);
  }

  res.status(200).send(paginatedVoices);
};

const voiceController = { getVoices };

export { voiceController };
