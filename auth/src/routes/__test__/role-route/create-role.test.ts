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
        name: Resource.ROLE,
        actions: canCreate ? [Action.CREATE] : [Action.UPDATE],
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

it('CREATE_ROLE: return 403 if user can not create role', async () => {
  const { user, password } = await setup();

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .post('/api/roles')
    .set('Cookie', cookie)
    .send({})
    .expect(403);
});

it('CREATE_ROLE: return 400 if params is invalid', async () => {
  const { user, password } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .post('/api/roles')
    .set('Cookie', cookie)
    .send({
      name: 'test role',
      resources: 'reare',
    })
    .expect(400);
  await request(app)
    .post('/api/roles')
    .set('Cookie', cookie)
    .send({
      name: 'test role',
      resources: [{ name: 'rieaore', actions: 'rieaofhed' }],
    })
    .expect(400);
  await request(app)
    .post('/api/roles')
    .set('Cookie', cookie)
    .send({
      name: 'test role',
      resources: [{ name: 'rieaore', actions: ['rieaofhed', 'reahore'] }],
    })
    .expect(400);
  await request(app)
    .post('/api/roles')
    .set('Cookie', cookie)
    .send({
      name: 'test role',
      resources: [
        { name: Resource.SENTENCE, actions: ['rieaofhed', 'reahore'] },
      ],
    })
    .expect(400);
  await request(app)
    .post('/api/roles')
    .set('Cookie', cookie)
    .send({
      name: 'test role',
      resources: [{ name: '', actions: Object.values(Action) }],
    })
    .expect(400);
});

it('CREATE_ROLE: return 400 if role name already taken', async () => {
  const { user, password, role } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .post('/api/roles')
    .set('Cookie', cookie)
    .send({
      name: role.name,
      resources: [
        {
          name: Resource.RECORD,
          actions: Object.values(Action),
        },
      ],
    })
    .expect(400);
});

it('CREATE_ROLE: success (200) if valid params and role name available', async () => {
  const { user, password, role } = await setup(true);

  const { cookie } = await global.getAuthCookie(user.phoneNumber, password);

  await request(app)
    .post('/api/roles')
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
    .expect(201);
});
