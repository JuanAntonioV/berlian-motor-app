import { getTableName, sql, Table } from 'drizzle-orm';
import { db, DB, pool, resetTable, schemaList } from './db';

async function truncate() {
  for (const table of schemaList) {
    await resetTable(db, table as Table);
  }
}

truncate()
  .catch((e) => {
    console.error(e);
    pool.end();
    process.exit(1);
  })
  .finally(async () => {
    pool.end();
    process.exit(0);
  });
