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
        name: Resource.ROLE,
        actions: canUpdate ? [Action.UPDATE] : [Action.READ],
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

it('UPDATE_ROLE: return 403 if user can not update role', async () => {
  const { user, password } = await setup();

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .put('/api/roles/update/reoarheoah')
    .set('Cookie', cookie)
    .send({})
    .expect(403);
});

it('UPDATE_ROLE: return 400 if role id is not valid or can not find role id', async () => {
  const { user, password } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .put('/api/roles/update/rehaorehia')
    .set('Cookie', cookie)
    .send({
      name: 'reahroei',
      resources: [
        {
          name: Resource.RECORD,
          actions: Object.values(Action),
        },
      ],
    })
    .expect(400);

  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/roles/update/${id}`)
    .set('Cookie', cookie)
    .send({
      name: 'reahroei',
      resources: [
        {
          name: Resource.RECORD,
          actions: Object.values(Action),
        },
      ],
    })
    .expect(400);
});

it('UPDATE_ROLE: return 400 if params is invalid', async () => {
  const { user, password, role } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .put(`/api/roles/update/${role.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'test role',
      resources: 'reare',
    })
    .expect(400);
  await request(app)
    .put(`/api/roles/update/${role.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'test role',
      resources: [{ name: 'rieaore', actions: 'rieaofhed' }],
    })
    .expect(400);
  await request(app)
    .put(`/api/roles/update/${role.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'test role',
      resources: [{ name: 'rieaore', actions: ['rieaofhed', 'reahore'] }],
    })
    .expect(400);
  await request(app)
    .put(`/api/roles/update/${role.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'test role',
      resources: [
        { name: Resource.SENTENCE, actions: ['rieaofhed', 'reahore'] },
      ],
    })
    .expect(400);
  await request(app)
    .put(`/api/roles/update/${role.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'test role',
      resources: [{ name: '', actions: Object.values(Action) }],
    })
    .expect(400);
});

it('UPDATE_ROLE: return 400 if role name already taken', async () => {
  const { user, password, role } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);
  const anotherRole = Role.build({
    name: 'another role',
    resources: [
      {
        name: Resource.RECORD,
        actions: [Action.CREATE],
      },
    ],
  });
  await anotherRole.save();

  await request(app)
    .put(`/api/roles/update/${role.id}`)
    .set('Cookie', cookie)
    .send({
      name: anotherRole.name,
      resources: [
        {
          name: Resource.RECORD,
          actions: Object.values(Action),
        },
      ],
    })
    .expect(400);
});

it('UPDATE_ROLE: success (200) if valid params and role name available', async () => {
  const { user, password, role } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  const response = await request(app)
    .put(`/api/roles/update/${role.id}`)
    .set('Cookie', cookie)
    .send({
      name: role.name + 'some thing diff',
      resources: [
        {
          name: Resource.RECORD,
          actions: Object.values(Action),
        },
      ],
    })
    .expect(200);

  expect(response.body.id).toEqual(role.id);
  expect(response.body.name).toEqual(role.name + 'some thing diff');
});
