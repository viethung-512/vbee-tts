import { body, param } from 'express-validator';
import { Action, Resource, isIdValid, isIdsValid } from '@tts-dev/common';

import { RoleDao } from '../daos/role-dao';

interface PermissionResource {
  name: Resource;
  actions: Action[];
}

function isResourcesValid(resources: any[]): resources is PermissionResource[] {
  if (resources as PermissionResource[]) {
    return true;
  }

  return false;
}

export const createRoleValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .custom(value => {
      const roleDao = new RoleDao();
      return roleDao.findItem({ name: value }).then(role => {
        if (role) {
          return Promise.reject('Role name already taken');
        }

        return Promise.resolve();
      });
    }),
  body('resources').custom(value => {
    if (!isResourcesValid(value)) {
      throw new Error('Resource is not valid');
    }
    const resourceValid = value.every(
      (rs: { name: Resource; actions: Action[] }) => {
        return (
          Object.values(Resource).includes(rs.name) &&
          rs.actions.every(act => Object.values(Action).includes(act))
        );
      }
    );

    if (!resourceValid) {
      throw new Error('Resource is not valid');
    }

    return true;
  }),
];

export const roleIdValidator = [
  param('id').custom(value => {
    if (!isIdValid(value)) {
      throw new Error('Role not found');
    }

    return true;
  }),
];

export const updateRoleValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Role name is required')
    .custom((value, { req }) => {
      const roleDao = new RoleDao();

      return roleDao
        .findItem({ name: value, _id: { $ne: req.params!.id } })
        .then(role => {
          if (role) {
            return Promise.reject('Role name already taken');
          }

          return Promise.resolve();
        });
    }),
  body('resources').custom(value => {
    if (!isResourcesValid(value)) {
      throw new Error('Resource is not valid');
    }

    const resourceValid = value.every(
      (rs: { name: Resource; actions: Action[] }) => {
        return (
          Object.values(Resource).includes(rs.name) &&
          rs.actions.every(act => Object.values(Action).includes(act))
        );
      }
    );

    if (!resourceValid) {
      return Promise.reject('Resource is not valid');
    }

    return Promise.resolve();
  }),
];

export const roleIdsValidator = [
  body('ids').custom((value: string[]) => {
    if (!isIdsValid(value)) {
      throw new Error('Missing ids or one of roleId is not valid');
    }

    return true;
  }),
];
