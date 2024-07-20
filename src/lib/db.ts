import { Pool } from 'pg';
import config from './config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

let sslMode = false;
if (config.APP_ENV === 'production') {
  sslMode = true;
}

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: sslMode,
  max: 20,
});

export const db = drizzle(pool, { logger: true, schema });
