import cookie from '@fastify/cookie';
import fastify from 'fastify';

import { transactionsRoutes } from './routes/transactions.js';

export const app = fastify();

// Global hook sample
app.addHook('preHandler', async request => {
  console.log(`[${request.method}] ${request.url}`);
});

app.register(cookie);
app.register(transactionsRoutes, { prefix: 'transactions' });
