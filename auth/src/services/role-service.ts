import {
  ServiceResponse,
  isValidMongooseId,
  PaginateQuery,
  PaginateResponse,
} from '@tts-dev/common';

import { RoleAttrs, RoleDoc } from '../models/role';
import { RoleDao } from '../daos/role-dao';

interface PaginatedRoles extends PaginateResponse {
  docs: RoleDoc[];
}

interface GetRolesResponse extends ServiceResponse {
  paginatedRoles?: PaginatedRoles;
}

interface GetRoleResponse extends ServiceResponse {
  role?: RoleDoc;
}

interface CreateRoleResponse extends ServiceResponse {
  role?: RoleDoc;
}

interface UpdateRoleResponse extends ServiceResponse {
  role?: RoleDoc;
}

interface DeleteRolesResponse extends ServiceResponse {
  roles?: RoleDoc[];
}

interface ApproveRolesResponse extends ServiceResponse {
  roles?: RoleDoc[];
}

const getRoles = async (query: PaginateQuery): Promise<GetRolesResponse> => {
  const roleDao = new RoleDao();

  const paginated = await roleDao.findAll({
    paginateQuery: query,
  });

  return {
    success: true,
    paginatedRoles: paginated,
  };
};

const getRole = async (id: string): Promise<GetRoleResponse> => {
  const roleDao = new RoleDao();
  const role = await roleDao.findItem(id);
  if (!role) {
    return {
      success: false,
    };
  }

  return { success: true, role };
};

const createRole = async (data: RoleAttrs): Promise<CreateRoleResponse> => {
  const roleDao = new RoleDao();

  const role = await roleDao.createItem(data);

  return { success: true, role };
};

const updateRole = async (
  roleId: string,
  data: RoleAttrs
): Promise<UpdateRoleResponse> => {
  const roleDao = new RoleDao();
  if (!isValidMongooseId(roleId)) {
    return {
      success: false,
      errors: [{ message: 'Role not found' }],
    };
  }

  const role = await roleDao.findItem(roleId);
  if (!role) {
    return {
      success: false,
      errors: [{ message: 'Role not found' }],
    };
  }

  const updatedRole = await roleDao.updateItem(role, data);
  return { success: true, role: updatedRole };
};

const deleteRoles = async (roleIds: string[]): Promise<DeleteRolesResponse> => {
  const roleDao = new RoleDao();

  const deletedResult = await Promise.all(
    roleIds.map(async id => {
      const role = await roleDao.findItem(id);
      if (!role) {
        return false;
      }

      await roleDao.deleteItem(role);
      return role;
    })
  );

  if (deletedResult.some(r => r === false)) {
    return {
      success: false,
      errors: [{ message: 'One of roles is not valid' }],
    };
  }

  const roles = deletedResult.filter(r => r !== false) as RoleDoc[];

  return { success: true, roles };
};

const approveRoles = async (
  roleIds: string[]
): Promise<ApproveRolesResponse> => {
  const approvedResult = await Promise.all(
    roleIds.map(async id => {
      const role = await approveRoleItem(id);
      return role;
    })
  );

  if (approvedResult.some(r => r === false)) {
    return {
      success: false,
      errors: [{ message: 'One of roles is not valid' }],
    };
  }

  const roles = approvedResult.filter(r => r !== false) as RoleDoc[];

  return { success: true, roles };
};

const approveRoleItem = async (id: string): Promise<RoleDoc | boolean> => {
  const roleDao = new RoleDao();

  const role = await roleDao.findItem(id);
  if (!role) {
    return false;
  }

  role.policy = {
    official_version: role.policy.draff_version,
    draff_version: null,
  };
  await role.save();

  return role;
};

const roleService = {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRoles,
  approveRoles,
};

export { roleService };
