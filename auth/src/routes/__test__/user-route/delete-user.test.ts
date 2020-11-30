import request from 'supertest';
import mongoose from 'mongoose';
import { rootRole } from '@tts-dev/common';

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

it('DELETE_USERS: return 403 if user is not root user', async () => {
  const { user, password } = await setup();

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .delete('/api/users/delete')
    .set('Cookie', cookie)
    .send({})
    .expect(403);
});

it('DELETE_USERS: return 400 if on of roleIds is not valid or can not find role with that id', async () => {
  const { cookie } = await global.getAuthCookie('0987654321', '123456');

  await request(app)
    .delete('/api/users/delete')
    .set('Cookie', cookie)
    .send({
      ids: ['reaoifheoa', 're9ahf9a'],
    })
    .expect(400);

  const id1 = new mongoose.Types.ObjectId().toHexString();
  const id2 = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .delete('/api/users/delete')
    .set('Cookie', cookie)
    .send({
      ids: [id1, id2],
    })
    .expect(400);

  await request(app)
    .delete('/api/users/delete')
    .set('Cookie', cookie)
    .send({
      ids: 'fdshaofho',
    })
    .expect(400);
});

it('DELETE_USERS: success delete if valid ids', async () => {
  const { cookie } = await global.getAuthCookie('0987654321', '123456');
  const { role } = await setup();

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

  let users = await User.find({});

  expect(users.length).toEqual(5);

  const response = await request(app)
    .delete('/api/users/delete')
    .set('Cookie', cookie)
    .send({
      ids: [user1.id, user2.id],
    })
    .expect(200);

  expect(response.body.length).toEqual(2);
  users = await User.find({});

  expect(users.length).toEqual(3);
});
