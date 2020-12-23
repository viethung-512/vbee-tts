import { Subjects, Publisher, ScreenshotCreatedEvent } from '@tts-dev/common';

export class ScreenshotCreatedPublisher extends Publisher<ScreenshotCreatedEvent> {
  subject: Subjects.SCREENSHOT_CREATED = Subjects.SCREENSHOT_CREATED;
}
