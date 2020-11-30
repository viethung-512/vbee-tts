import request from 'supertest';
import mongoose from 'mongoose';
import { Resource, Action } from '@tts-dev/common';

import { app } from '../../../app';
import { User } from '../../../models/user';
import { Role } from '../../../models/role';

const setup = async (canUpdate: boolean = false) => {
  const role = Role.build({
    name: 'role 1',
    resources: [
      {
        name: Resource.USER,
        actions: canUpdate ? [Action.UPDATE] : [Action.READ],
      },
    ],
  });
  await role.save();

  const user = User.build({
    username: 'bang',
    email: 'bang@test.com',
    phoneNumber: '0966382597',
    password: '123456',
    role: role,
  });
  await user.save();

  return { role, user, password: '123456' };
};

it('UPDATE_USER: return 403 if auth user can not update user', async () => {
  const { user, password } = await setup();

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .put(`/api/users/update/ieraorie`)
    .set('Cookie', cookie)
    .send({})
    .expect(403);
});

it('UPDATE_USER: return 400 if can userId is not valid or can not find user with id', async () => {
  const { role, user, password } = await setup(true);
  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .put('/api/users/update/irudaoreo')
    .set('Cookie', cookie)
    .send({
      username: 'bang',
    })
    .expect(400);

  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/users/update/${id}`)
    .set('Cookie', cookie)
    .send({
      username: 'bang',
    })
    .expect(400);
});

it('UPDATE_USER: return 400 if params is invalid', async () => {
  const { user, password } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .put(`/api/users/update/${user.id}`)
    .set('Cookie', cookie)
    .send({
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      roleId: '',
    })
    .expect(400);

  await request(app)
    .put(`/api/users/update/${user.id}`)
    .set('Cookie', cookie)
    .send({
      username: '',
      email: 'fdoajfod',
      phoneNumber: 'fhdaiofhodiaf',
      roleId: 'fdaojfod',
    })
    .expect(400);
});

it('UPDATE_USER: return 400 if username already taken', async () => {
  const { user, password, role } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  const user1 = User.build({
    username: 'test',
    email: 'test@test.com',
    phoneNumber: '0987896785',
    password: '123456',
    role,
  });
  await user1.save();

  await request(app)
    .put(`/api/users/update/${user.id}`)
    .set('Cookie', cookie)
    .send({
      username: user1.username,
    })
    .expect(400);
});

it('UPDATE_USER: return 400 if email already taken', async () => {
  const { user, password, role } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  const user1 = User.build({
    username: 'test',
    email: 'test@test.com',
    phoneNumber: '0987896785',
    password: '123456',
    role,
  });
  await user1.save();

  await request(app)
    .put(`/api/users/update/${user.id}`)
    .set('Cookie', cookie)
    .send({
      email: user1.email,
    })
    .expect(400);
});

it('UPDATE_USER: return 400 if phoneNumber already taken', async () => {
  const { user, password, role } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  const user1 = User.build({
    username: 'test',
    email: 'test@test.com',
    phoneNumber: '0987896785',
    password: '123456',
    role,
  });
  await user1.save();

  await request(app)
    .put(`/api/users/update/${user.id}`)
    .set('Cookie', cookie)
    .send({
      phoneNumber: user1.phoneNumber,
    })
    .expect(400);
});

it('UPDATE_USER: success (200) if valid params, and username, email, phoneNumber available', async () => {
  const { user, password, role } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  const username = 'username test';
  const email = 'email-test@gmail.com';
  const phoneNumber = '0987654345';

  const response = await request(app)
    .put(`/api/users/update/${user.id}`)
    .set('Cookie', cookie)
    .send({
      username,
      email,
      phoneNumber,
    })
    .expect(200);

  expect(response.body.username).toEqual(username);
  expect(response.body.email).toEqual(email);
  expect(response.body.phoneNumber).toEqual(phoneNumber);
});
