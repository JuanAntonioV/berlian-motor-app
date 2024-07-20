import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, pool } from './db';

async function main() {
  await migrate(db, { migrationsFolder: './migrations' });
  await pool.end();
}

main().catch(console.error);
