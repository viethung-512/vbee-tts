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
};

it('LOG_OUT: success and cookie has been cleared', async () => {
  const phoneNumber = '0966382597';
  const password = 'password';

  await prepareUser(phoneNumber, password);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ phoneNumber, password })
    .expect(200);

  expect(loginRes.get('Set-Cookie')).toBeDefined();

  const logoutRes = await request(app).post('/api/auth/logout').expect(200);
  expect(logoutRes.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
