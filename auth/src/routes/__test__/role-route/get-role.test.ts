import request from 'supertest';
import mongoose from 'mongoose';
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

it('GET_ROLE: return 403 if user can not read role', async () => {
  const { user, password } = await setup();

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .get('/api/roles/fhdoajfod')
    .set('Cookie', cookie)
    .send({})
    .expect(403);
});

it('GET_ROLE: return 404 if can not find role or role id is not valid', async () => {
  const { user, password } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .get(`/api/roles/rfeaofjoad`)
    .set('Cookie', cookie)
    .send({})
    .expect(404);

  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/roles/${id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(404);
});

it('GET_ROLE: return role', async () => {
  const { user, password, role } = await setup(true);
  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  const response = await request(app)
    .get(`/api/roles/${role.id}`)
    .set('Cookie', cookie)
    .expect(200);

  expect(response.body.id).toEqual(role.id);
  expect(response.body.name).toEqual(role.name);
  expect(response.body.resources.length).toEqual(role.resources.length);
});
