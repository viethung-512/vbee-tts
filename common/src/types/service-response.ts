import { FieldError } from './field-error';

export interface ServiceResponse {
  success: boolean;
  errors?: FieldError[];
}
