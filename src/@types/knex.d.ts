import type { Knex } from 'knex';

// force typescript to recognize this file as a module
type _KnexCheck = Knex;

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string;
      title: string;
      amount: number;
      created_at: string;
      session_id: string;
    };
  }
}
