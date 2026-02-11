import cookie from '@fastify/cookie';
import fastify from 'fastify';

import { env } from './env/index.js';
import { transactionsRoutes } from './routes/transactions.js';

const app = fastify();

// Global hook sample
app.addHook('preHandler', async request => {
  console.log(`[${request.method}] ${request.url}`);
});

app.register(cookie);
app.register(transactionsRoutes, { prefix: 'transactions' });

app.listen({ port: env.PORT }).then(() => console.log('Server Running! 💀'));
