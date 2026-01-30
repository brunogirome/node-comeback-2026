import fastify from 'fastify';
import crypto from 'node:crypto';
import { knex } from './database.js';
import { env } from './env/index.js';

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

app.listen({ port: env.PORT }).then(() => console.log('Server Running! 💀'));
