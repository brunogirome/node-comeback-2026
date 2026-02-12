import request from 'supertest';
import { afterAll, beforeAll, describe, it } from 'vitest';

import { app } from '../src/app.js';

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({ title: 'Test Transaction', amount: 113, type: 'credit' })
      .expect(201);
  });
});
