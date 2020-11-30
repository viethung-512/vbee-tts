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

it('CHANGE_PASSWORD: return 400 if user unauthenticated', async () => {
  await prepareUser();

  await request(app).put('/api/auth/change-password').send({}).expect(401);
});

it('CHANGE_PASSWORD: return 400 if invalid params', async () => {
  const phoneNumber = '0966382597';
  const password = '123456';

  await prepareUser(phoneNumber, password);
  const { cookie } = await global.getAuthCookie(phoneNumber, password);

  await request(app)
    .put('/api/auth/change-password')
    .set('Cookie', cookie)
    .send({ oldPassword: '', newPassword: '' })
    .expect(400);
  await request(app)
    .put('/api/auth/change-password')
    .set('Cookie', cookie)
    .send({ oldPassword: '123456' })
    .expect(400);
  await request(app)
    .put('/api/auth/change-password')
    .set('Cookie', cookie)
    .send({ newPassword: '123456' })
    .expect(400);
  await request(app)
    .put('/api/auth/change-password')
    .set('Cookie', cookie)
    .send({})
    .expect(400);
});

it('CHANGE_PASSWORD: return 400 if can not find user with authUserId', async () => {
  const phoneNumber = '0966382597';
  const password = '123456';

  await prepareUser(phoneNumber, password);
  const { cookie, user } = await global.getAuthCookie(phoneNumber, password);

  await User.findByIdAndDelete(user.id);

  await request(app)
    .put('/api/auth/change-password')
    .set('Cookie', cookie)
    .send({ oldPassword: '123456', newPassword: '123456' })
    .expect(400);
});

it('CHANGE_PASSWORD: return 400 oldPassword is not match with authUser password', async () => {
  const phoneNumber = '0966382597';
  const password = '123456';

  await prepareUser(phoneNumber, password);
  const { cookie } = await global.getAuthCookie(phoneNumber, password);

  await request(app)
    .put('/api/auth/change-password')
    .set('Cookie', cookie)
    .send({ oldPassword: '123456789', newPassword: '123456' })
    .expect(400);
});

it('CHANGE_PASSWORD: return 400 newPassword === oldPassword', async () => {
  const phoneNumber = '0966382597';
  const password = '123456';

  await prepareUser(phoneNumber, password);
  const { cookie } = await global.getAuthCookie(phoneNumber, password);

  await request(app)
    .put('/api/auth/change-password')
    .set('Cookie', cookie)
    .send({ oldPassword: '123456', newPassword: '123456' })
    .expect(400);
});

it('CHANGE_PASSWORD: return 200, success change password', async () => {
  const phoneNumber = '0966382597';
  const password = '123456';

  await prepareUser(phoneNumber, password);
  const { cookie, user } = await global.getAuthCookie(phoneNumber, password);

  await request(app)
    .put('/api/auth/change-password')
    .set('Cookie', cookie)
    .send({ oldPassword: '123456', newPassword: '1234567' })
    .expect(200);

  const updatedUser = await User.findById(user.id);
  expect(updatedUser).toBeDefined();

  await request(app)
    .post('/api/auth/login')
    .send({ phoneNumber, password })
    .expect(400);
  await request(app)
    .post('/api/auth/login')
    .send({ phoneNumber, password: '1234567' })
    .expect(200);
});
