import { CustomError } from './custom-error';
import { FieldError } from '../types/field-error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public msg: string, public errors?: FieldError[]) {
    super(msg);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    if (this.errors && this.errors.length > 0) {
      return this.errors;
    }

    return [
      {
        message: this.msg,
      },
    ];
  }
}
