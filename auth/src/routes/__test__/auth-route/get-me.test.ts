import request from 'supertest';
import { rootRole } from '@tts-dev/common';

import { app } from '../../../app';
import { User } from '../../../models/user';
import { Role } from '../../../models/role';

const prepareUser = async (
  phoneNumber: string = '0966382597',
  password: string = 'password'
) => {
  const role = Role.build(rootRole);
  await role.save();

  const user = User.build({
    username: 'bang',
    email: 'bang@test.com',
    phoneNumber: phoneNumber,
    password: password,
    role: role,
  });
  await user.save();

  return user;
};

it('GET_ME: return Authentication Error (401) if user is not logged in', async () => {
  const phoneNumber = '0966382597';
  const password = 'password';

  await prepareUser(phoneNumber, password);

  await request(app)
    .get('/api/auth/me')
    .send({ phoneNumber, password })
    .expect(401);
});

it('GET_ME: return { authUser: data } success', async () => {
  const { cookie, user } = await global.getAuthCookie();

  const response = await request(app)
    .get('/api/auth/me')
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  console.log(response.body);

  expect(response.body.id).toEqual(user.id);
  expect(response.body.username).toEqual(user.username);
  expect(response.body.email).toEqual(user.email);
  expect(response.body.phoneNumber).toEqual(user.phoneNumber);
});
