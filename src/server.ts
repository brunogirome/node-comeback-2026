import fastify from 'fastify';
import crypto from 'node:crypto';
import { knex } from './database.js';

const app = fastify();

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

app.listen({ port: 3333 }).then(() => console.log('Server Running! 💀'));
