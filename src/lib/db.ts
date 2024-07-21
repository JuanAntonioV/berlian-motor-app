import { Pool } from 'pg';
import config from './config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { getTableName, sql, Table } from 'drizzle-orm';

let sslMode = false;
if (config.APP_ENV === 'production') {
  sslMode = true;
}

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: sslMode,
  max: 1,
});

export const db = drizzle(pool, { logger: true, schema });

export type DB = typeof db;

export async function resetTable(db: DB, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
  );
}

export const schemaList = [
  schema.permissions,
  schema.roles,
  schema.users,
  schema.authenticators,
  schema.sessions,
  schema.accounts,
  schema.rolePermissions,
  schema.userPermissions,
  schema.userRoles,
  schema.userStores,
  schema.brands,
  schema.categories,
  schema.stores,
  schema.products,
  schema.shelfs,
  schema.storeShelfs,
  schema.productStockLogs,
  schema.productStocks,
  schema.productCategories,
  schema.productExpenditureItems,
  schema.productExpenditures,
  schema.stockTransfers,
  schema.stockTransferItems,
  schema.stockAdjustmentItems,
  schema.stockAdjustments,
  schema.goodsReceipts,
  schema.goodsReceiptItems,
];
