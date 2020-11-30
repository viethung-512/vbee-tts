import request from 'supertest';
import { Resource, Action } from '@tts-dev/common';

import { app } from '../../../app';
import { User } from '../../../models/user';
import { Role } from '../../../models/role';

const setup = async (canRead: boolean = false) => {
  const role = Role.build({
    name: 'sample role',
    resources: [
      {
        name: Resource.ROLE,
        actions: canRead ? [Action.READ] : [Action.CREATE],
      },
    ],
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

it('GET_ROLES: return 403 if user can not read role', async () => {
  const { user, password } = await setup();

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .get('/api/roles')
    .set('Cookie', cookie)
    .send({})
    .expect(403);
});

it('GET_ROLES: return roles', async () => {
  const { user, password } = await setup(true);
  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  const role1 = Role.build({
    name: 'role1',
    resources: [
      {
        name: Resource.USER,
        actions: Object.values(Action),
      },
    ],
  });
  const role2 = Role.build({
    name: 'role1',
    resources: [
      {
        name: Resource.USER,
        actions: Object.values(Action),
      },
    ],
  });
  const role3 = Role.build({
    name: 'role1',
    resources: [
      {
        name: Resource.USER,
        actions: Object.values(Action),
      },
    ],
  });

  await role1.save();
  await role2.save();
  await role3.save();

  const response = await request(app)
    .get('/api/roles')
    .set('Cookie', cookie)
    .expect(200);

  expect(response.body.totalDocs).toEqual(5);
  expect(response.body.totalPages).toEqual(1);
  expect(response.body.page).toEqual(0);
  expect(response.body.limit).toEqual(10);
});
