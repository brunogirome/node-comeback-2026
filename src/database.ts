import knexSetup from 'knex';
import config from '../knexfile.js';

export const knex = knexSetup(config);
