import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { rootRole } from '@tts-dev/common';

import { app } from '../app';
import { Role } from '../models/role';
import { User, UserDoc } from '../models/user';

let mongo: any;

declare global {
  namespace NodeJS {
    interface Global {
      getAuthCookie(
        phoneNumber?: string,
        password?: string
      ): Promise<{
        cookie: string[];
        user: UserDoc;
      }>;
    }
  }
}

beforeAll(async () => {
  process.env.JWT_SECRET = 'secret-key';

  mongo = new MongoMemoryServer();
  const mongoURI = await mongo.getUri();

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

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

global.getAuthCookie = async (
  phoneNumber: string = '0966382597',
  password: string = 'password'
) => {
  const user = await prepareUser(phoneNumber, password);

  const response = await request(app)
    .post('/api/auth/login')
    .send({ phoneNumber, password })
    .expect(200);
  const cookie = response.get('Set-Cookie');

  return { cookie, user };
};
