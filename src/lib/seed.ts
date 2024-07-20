import { getTableName, sql, Table } from 'drizzle-orm';
import config from './config';
import * as seeds from './seeds';
import * as schema from './schema';
import { DB, db, pool, resetTable, schemaList } from './db';

if (!config.DB_SEED) {
  console.log('DB_SEED is not true, exiting...');
  process.exit(0);
}

async function seed() {
  for (const table of schemaList) {
    await resetTable(db, table as Table);
  }

  await seeds.stores(db);
  await seeds.permissions(db);
  await seeds.roles(db);
  await seeds.users(db);
}

seed()
  .catch((e) => {
    console.error(e);
    pool.end();
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seed complete 🌱');
    pool.end();
    process.exit(0);
  });
