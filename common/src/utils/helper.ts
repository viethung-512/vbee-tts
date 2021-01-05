import mongoose from 'mongoose';
import { rootRole } from '../constants/root-role';
import { Action } from '../types/action';
import { AuthUser } from '../types/auth-user';
import { Resource } from '../types/resource';

export const isEmpty = (str: string): boolean => {
  return str.trim() === '';
};

export const isValidEmail = (email: string): boolean => {
  const regEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  return regEx.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const regEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  return regEx.test(phone);
};

export const isValidMongooseId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const canAccessResource = (
  user: AuthUser,
  resource: Resource,
  action: Action
): boolean => {
  if (user) {
    if (user.role.name === rootRole.name) {
      return true;
    }
    if (
      user.role.resources.some(
        rs => rs.name === resource && rs.actions.includes(action)
      )
    ) {
      return true;
    }
    return false;
  } else {
    return false;
  }
};

export const isIdsValid = (ids: string[]): ids is string[] => {
  if (ids as string[]) {
    for (const id of ids) {
      if (!isValidMongooseId(id)) {
        return false;
      }
    }

    return true;
  }

  return false;
};

export const isIdValid = (id: string): id is string => {
  if ((id as string) && isValidMongooseId(id)) {
    return true;
  }

  return false;
};
