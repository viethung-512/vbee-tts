import request from 'supertest';
import mongoose from 'mongoose';
import { Resource, Action, rootRole } from '@tts-dev/common';

import { app } from '../../../app';
import { User } from '../../../models/user';
import { Role } from '../../../models/role';

const setup = async (isRootUser: boolean = false) => {
  const role = Role.build({
    name: isRootUser ? rootRole.name : 'sample role',
    resources: rootRole.resources,
  });
  await role.save();

  const user = User.build({
    username: 'bang',
    phoneNumber: '0966382597',
    email: 'bang@test.com',
    password: '123456',
    role,
  });
  await user.save();

  return { role, user, password: '123456' };
};

it('APPROVE_ROLES: return 403 if user is not root user', async () => {
  const { user, password } = await setup();

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .put('/api/roles/approve')
    .set('Cookie', cookie)
    .send({})
    .expect(403);
});

it('APPROVE_ROLES: return 400 if on of roleIds is not valid or can not find role with that id', async () => {
  const { cookie } = await global.getAuthCookie('0987654321', '123456');

  await request(app)
    .put('/api/roles/approve')
    .set('Cookie', cookie)
    .send({
      ids: ['reaoifheoa', 're9ahf9a'],
    })
    .expect(400);

  const id1 = new mongoose.Types.ObjectId().toHexString();
  const id2 = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .delete('/api/roles/delete')
    .set('Cookie', cookie)
    .send({
      ids: [id1, id2],
    })
    .expect(400);

  await request(app)
    .delete('/api/roles/delete')
    .set('Cookie', cookie)
    .send({
      ids: 'fdshaofho',
    })
    .expect(400);
});

it('APPROVE_ROLES: success approve role if valid ids', async () => {
  const { cookie } = await global.getAuthCookie('0987654321', '123456');
  const role1 = Role.build({
    name: 'role 1',
    resources: [
      {
        name: Resource.USER,
        actions: Object.values(Action),
      },
    ],
    policy: 'this role need approve',
  });
  const role2 = Role.build({
    name: 'role 2',
    resources: [
      {
        name: Resource.SENTENCE,
        actions: Object.values(Action),
      },
    ],
    policy: 'this role need approve',
  });
  const role3 = Role.build({
    name: 'role 3',
    resources: [
      {
        name: Resource.RECORD,
        actions: Object.values(Action),
      },
    ],
    policy: 'this role need approve',
  });

  await role1.save();
  await role2.save();
  await role3.save();

  let roles = await Role.find({});

  expect(roles.length).toEqual(4);

  const response = await request(app)
    .put('/api/roles/approve')
    .set('Cookie', cookie)
    .send({
      ids: [role1.id, role2.id],
    })
    .expect(200);

  const updatedRole1 = await Role.findById(role1.id);
  const updatedRole2 = await Role.findById(role2.id);
  const updatedRole3 = await Role.findById(role3.id);

  expect(updatedRole1!.policy.official_version).toEqual(
    role1.policy.draff_version
  );
  expect(updatedRole1!.policy.draff_version).toBeNull();
  expect(updatedRole2!.policy.official_version).toEqual(
    role2.policy.draff_version
  );
  expect(updatedRole2!.policy.draff_version).toBeNull();
  expect(updatedRole3!.policy.official_version).toBeNull();
  expect(updatedRole3!.policy.draff_version).toEqual(
    role3.policy.draff_version
  );

  expect(response.body.length).toEqual(2);
});
