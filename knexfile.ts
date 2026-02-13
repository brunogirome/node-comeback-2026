import type { Knex } from 'knex';
// @ts-expect-error - Vitest doesn't support ESM yet, so we need to ignore this error
import { env } from './src/env/index.ts';

const config: Knex.Config = {
  client: 'better-sqlite3',
  connection:
    env.DATABASE_CLIENT === 'better-sqlite3'
      ? { filename: env.DATABASE_URL }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
};

export default config;
