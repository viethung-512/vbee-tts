import express from 'express';
import { authUser, requireRootUser } from '@tts-dev/common';
import { voiceController } from '../controllers/voice-controller';

const router = express.Router();

router.get('/', authUser, requireRootUser, voiceController.getVoices);

export { router as voiceRoute };
