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

it('LOGIN: return 400 if invalid phone number', async () => {
  await request(app)
    .post('/api/auth/login')
    .send({ phoneNumber: 'roeahorehoare', password: 'password' })
    .expect(400);
});

it('LOGIN: return 400 if missing phone number or password', async () => {
  // missing phone number
  await request(app)
    .post('/api/auth/login')
    .send({ password: 'password' })
    .expect(400);

  // missing password
  await request(app)
    .post('/api/auth/login')
    .send({ phoneNumber: '0966382597' })
    .expect(400);
});

it('LOGIN: return 400 if phone number is not register', async () => {
  await request(app)
    .post('/api/auth/login')
    .send({ phoneNumber: '0966382597', password: 'password' })
    .expect(400);
});

it('LOGIN: return 400 if password is incorrect', async () => {
  const phoneNumber = '0966382597';
  const password = 'password';

  await prepareUser(phoneNumber, password);

  await request(app)
    .post('/api/auth/login')
    .send({ phoneNumber, password: `${password}-123` })
    .expect(400);
});

it('LOGIN: return 200, success with cookie in req', async () => {
  const phoneNumber = '0966382597';
  const password = 'password';

  await prepareUser(phoneNumber, password);

  const response = await request(app)
    .post('/api/auth/login')
    .send({ phoneNumber, password })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
