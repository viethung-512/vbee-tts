import { Publisher, GGDriverInitializedEvent, Subjects } from '@tts-dev/common';

export class GGDriverInitializedPublisher extends Publisher<GGDriverInitializedEvent> {
  subject: Subjects.GG_DRIVER_INITIALIZED = Subjects.GG_DRIVER_INITIALIZED;
}
