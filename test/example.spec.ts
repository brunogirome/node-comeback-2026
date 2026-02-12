import request from 'supertest';
import { afterAll, beforeAll, test } from 'vitest';

import { app } from '../src/app.js';

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test('example test', async () => {
  await request(app.server)
    .post('/transactions')
    .send({ title: 'Test Transaction', amount: 113, type: 'credit' })
    .expect(201);
});
