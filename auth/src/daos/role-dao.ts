import { BaseDao } from '@tts-dev/common';
import { RoleAttrs, RoleDoc, RoleModel, Role } from '../models/role';

export class RoleDao extends BaseDao<RoleDoc, RoleModel, RoleAttrs> {
  model = Role;
  populate = [];

  async createItem(data: RoleAttrs) {
    const role = Role.build({
      name: data.name,
      resources: data.resources,
      policy: data.policy,
    });

    await role.save();

    return role;
  }

  async updateItem(role: RoleDoc, data: RoleAttrs) {
    role.name = data.name || role.name;
    role.resources = data.resources || role.resources;
    if (data.policy) {
      role.policy = {
        official_version: null,
        draft_version: data.policy,
      };
    }
    await role.save();

    return role;
  }

  async deleteItem(role: RoleDoc) {
    const deleted = await Role.findByIdAndDelete(role.id);

    return deleted;
  }
}
