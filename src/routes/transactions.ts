import type { FastifyInstance } from 'fastify';
import crypto from 'node:crypto';
import { knex } from '../database.js';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/test', async () => {
    const transaction = await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title: 'Test Transaction',
        amount: 1000,
      })
      .returning('*');

    return transaction;
  });
}
