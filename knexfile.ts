import type { Knex } from 'knex';
import { env } from './src/env/index.js';

const config: Knex.Config = {
  client: 'better-sqlite3',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
};

export default config;
