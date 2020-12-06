import { Role } from './role';

export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
}
