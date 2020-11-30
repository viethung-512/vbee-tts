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
        name: Resource.USER,
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

it('GET_USERS: return 403 if user can not read user', async () => {
  const { user, password } = await setup();

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .get('/api/users')
    .set('Cookie', cookie)
    .send({})
    .expect(403);
});

it('GET_USERS: return users', async () => {
  const { user, password, role } = await setup(true);
  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  const user1 = User.build({
    username: 'user1',
    email: 'user1@test.comt',
    phoneNumber: '0987897865',
    password: '1234567',
    role,
  });
  const user2 = User.build({
    username: 'user2',
    email: 'user2@test.comt',
    phoneNumber: '0987897856',
    password: '1234567',
    role,
  });
  const user3 = User.build({
    username: 'user3',
    email: 'user3@test.comt',
    phoneNumber: '0987897887',
    password: '1234567',
    role,
  });

  await user1.save();
  await user2.save();
  await user3.save();

  const response = await request(app)
    .get('/api/users')
    .set('Cookie', cookie)
    .expect(200);

  expect(response.body.totalDocs).toEqual(5);
  expect(response.body.totalPages).toEqual(1);
  expect(response.body.page).toEqual(0);
  expect(response.body.limit).toEqual(10);
});
