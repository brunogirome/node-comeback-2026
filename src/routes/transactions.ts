import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { knex } from '../database.js';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists.js';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async request => {
    const sessionId = request.cookies.sessionId;

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select();

    return { transactions };
  });

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async request => {
    const getTransactionParamSchema = z.object({
      id: z.string().uuid(),
    });
    const sessionId = request.cookies.sessionId;

    const { id } = getTransactionParamSchema.parse(request.params);

    const transaction = await knex('transactions')
      .where({ id })
      .andWhere('session_id', sessionId)
      .first();

    return { transaction };
  });

  app.get('/summary', { preHandler: [checkSessionIdExists] }, async request => {
    const sessionId = request.cookies.sessionId;

    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .where('session_id', sessionId)
      .first();

    return { summary };
  });

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    let sessionId = request.cookies.sessionId;
    if (!sessionId) {
      sessionId = randomUUID();
      reply.cookie('sessionId', sessionId, {
        path: '/', // every route can access this cookie
        maxAge: 60 * 60 * 24 * 7, // 7 days -> seconds * minutes * hours * days
      });
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
