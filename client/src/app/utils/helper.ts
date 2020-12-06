import { Resource, Action } from '@tts-dev/common';

import { dialects } from './constants';
import { uidLength } from './config';

export const isEmpty = (str: string): boolean => {
  return str.trim() === '';
};

// export const canAccessResource = ({ user, resource, action }) => {
//   if (user) {
//     if (user.role.name === rootUser.name) {
//       return true;
//     }
//     if (
//       user.role.resources.some(
//         rs => rs.name === resource && rs.actions.includes(action)
//       )
//     ) {
//       return true;
//     }
//     // if (eval(user.role.policy)) {
//     //   return true;
//     // }
//   } else {
//     return false;
//   }
// };

export const formatResources = (
  resources: { name: Resource; actions: Action[] }[]
) => {
  return resources.map(rs => {
    const resourceName = getResourceName(rs.name);
    const resourceActions = rs.actions.map(act => getActionName(act));

    return { ...rs, name: resourceName, actions: resourceActions };
  });
};

export const getResourceName = (rsCode: Resource) => {
  let rsName = '';

  switch (rsCode) {
    case Resource.USER:
      rsName = 'User';
      break;
    case Resource.ROLE:
      rsName = 'Role';
      break;
    case Resource.SENTENCE:
      rsName = 'Sentence';
      break;
    case Resource.RECORD:
      rsName = 'Record';
      break;
    default:
      rsName = 'User';
      break;
  }

  return rsName;
};

export const getActionName = (actCode: Action) => {
  let actName = '';

  switch (actCode) {
    case Action.CREATE:
      actName = 'Tạo mới';
      break;
    case Action.READ:
      actName = 'Xem';
      break;
    case Action.UPDATE:
      actName = 'Chỉnh sửa';
      break;
    case Action.DELETE:
      actName = 'Xóa';
      break;
    default:
      actName = 'Xem';
      break;
  }

  return actName;
};

// TODO: need to update
export const getDialectInput = (dialect: any) => {
  const inputValue = {
    name: '',
    label: '',
  };
  switch (dialect.name) {
    case dialects.SAIGON:
      inputValue.name = 'dialectSG';
      inputValue.label = 'Cách đọc giọng Sài Gòn';
      break;
    case dialects.HANOI:
    default:
      inputValue.name = 'dialectHN';
      inputValue.label = 'Cách đọc giọng Hà Nội';
      break;
  }

  return inputValue;
};

export const formatUID = (uid: number): string => {
  if (!uid) return '';
  return uid.toString().padStart(uidLength, '0');
};

export const blobToFile = (theBlob: any, fileName: string) => {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};
