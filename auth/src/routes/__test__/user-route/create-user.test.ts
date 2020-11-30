import request from 'supertest';
import { Resource, Action } from '@tts-dev/common';

import { app } from '../../../app';
import { User } from '../../../models/user';
import { Role } from '../../../models/role';

const setup = async (canCreate: boolean = false) => {
  const role = Role.build({
    name: 'role 1',
    resources: [
      {
        name: Resource.USER,
        actions: canCreate ? [Action.CREATE] : [Action.READ],
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

it('CREATE_USER: return 403 if auth user can not create user', async () => {
  const { user, password } = await setup();

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .post('/api/users')
    .set('Cookie', cookie)
    .send({})
    .expect(403);
});

it('CREATE_USER: return 400 if params is invalid', async () => {
  const { user, password } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .post('/api/users')
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
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      email: '',
      phoneNumber: '',
      password: '',
      roleId: '',
    })
    .expect(400);
  await request(app)
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      username: '',
      phoneNumber: '',
      password: '',
      roleId: '',
    })
    .expect(400);
  await request(app)
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      username: '',
      email: '',
      password: '',
      roleId: '',
    })
    .expect(400);
  await request(app)
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      username: '',
      email: '',
      phoneNumber: '',
      roleId: '',
    })
    .expect(400);
  await request(app)
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
    })
    .expect(400);
  await request(app)
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      username: '',
      email: 'fdoajfod',
      phoneNumber: 'fhdaiofhodiaf',
      password: 'of',
      roleId: 'fdaojfod',
    })
    .expect(400);
});

it('CREATE_USER: return 400 if username already taken', async () => {
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
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      username: user1.username,
      email: 'user@test.com',
      phoneNumber: '0976567897',
      password: '123456',
      roleId: role.id,
    })
    .expect(400);
});

it('CREATE_USER: return 400 if email already taken', async () => {
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
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      username: `${user1.username} some else`,
      email: user1.email,
      phoneNumber: '0976567897',
      password: '123456',
      roleId: role.id,
    })
    .expect(400);
});

it('CREATE_USER: return 400 if phoneNumber already taken', async () => {
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
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      username: `${user1.username} diff`,
      email: 'user1@test.com',
      phoneNumber: user1.phoneNumber,
      password: '123456',
      roleId: role.id,
    })
    .expect(400);
});

it('CREATE_USER: success (200) if valid params, and username, email, phoneNumber available', async () => {
  const { user, password, role } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  const username = 'username test';
  const email = 'email-test@gmail.com';
  const phoneNumber = '0987654345';

  const response = await request(app)
    .post('/api/users')
    .set('Cookie', cookie)
    .send({
      username,
      email,
      phoneNumber,
      password: '123456',
      roleId: role.id,
    })
    .expect(201);

  expect(response.body.username).toEqual(username);
  expect(response.body.email).toEqual(email);
  expect(response.body.phoneNumber).toEqual(phoneNumber);
});
