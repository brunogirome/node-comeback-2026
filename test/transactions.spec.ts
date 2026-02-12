import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { execSync } from 'node:child_process';
import { app } from '../src/app.js';

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('pnpm migrate:rollback --all');
    execSync('pnpm migrate:latest');
  });

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({ title: 'Test Transaction', amount: 113, type: 'credit' })
      .expect(201);
  });

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction',
        amount: 113,
        type: 'credit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies || []);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({ title: 'Test Transaction', amount: 113 }),
    ]);
  });

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction',
        amount: 113,
        type: 'credit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies || []);

    const transcationId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transcationId}`)
      .set('Cookie', cookies || [])
      .expect(200);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({ title: 'Test Transaction', amount: 113 })
    );
  });

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit Transaction',
        amount: 500,
        type: 'credit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies || [])
      .send({
        title: 'Debit Transaction',
        amount: 250,
        type: 'debit',
      });

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies || []);

    expect(summaryResponse.body.summary).toEqual({ amount: 250 });
  });
});
