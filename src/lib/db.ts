import { Pool } from 'pg';
import config from './config';
import { drizzle } from 'drizzle-orm/node-postgres';

let sslMode = '';
if (config.APP_ENV === 'production') {
  sslMode = '?sslmode=require';
}

export const pool = new Pool({
  connectionString: config.DATABASE_URL + sslMode,
});

export const db = drizzle(pool, { logger: true });
