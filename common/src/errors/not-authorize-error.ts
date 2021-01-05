import { CustomError } from './custom-error';

export class UnAuthorizeError extends CustomError {
  statusCode = 403;

  constructor() {
    super('Unauthorized');

    Object.setPrototypeOf(this, UnAuthorizeError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: 'Unauthorized',
      },
    ];
  }
}
