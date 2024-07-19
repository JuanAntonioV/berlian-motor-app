import { relations, sql } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email'),
  password: varchar('password'),
  status: boolean('status').notNull(),
  joinDate: timestamp('join_date').defaultNow(),
  avatar: varchar('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const userRoles = pgTable(
  'user_roles',
  {
    userId: bigserial('user_id', { mode: 'bigint' })
      .notNull()
      .references(() => users.id),
    roleId: serial('role_id')
      .notNull()
      .references(() => roles.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
  })
);

export const userRelations = relations(users, ({ many }) => ({
  roles: many(roles),
  permissions: many(permissions),
}));

export const roleRelations = relations(roles, ({ many }) => ({
  users: many(users),
  permissions: many(permissions),
}));

export const userRoleRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: serial('role_id')
      .notNull()
      .references(() => roles.id),
    permissionId: serial('permission_id')
      .notNull()
      .references(() => permissions.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
  })
);

export const permissionRelations = relations(permissions, ({ many }) => ({
  roles: many(roles),
}));

export const rolePermissionRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  })
);

// userpermission

export const userPermissions = pgTable(
  'user_permissions',
  {
    userId: bigserial('user_id', { mode: 'bigint' })
      .notNull()
      .references(() => users.id),
    permissionId: serial('permission_id')
      .notNull()
      .references(() => permissions.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.permissionId] }),
  })
);

export const userPermissionRelations = relations(
  userPermissions,
  ({ one }) => ({
    user: one(users, {
      fields: [userPermissions.userId],
      references: [users.id],
    }),
    permission: one(permissions, {
      fields: [userPermissions.permissionId],
      references: [permissions.id],
    }),
  })
);

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  status: boolean('status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  status: boolean('status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const shelfs = pgTable('shelfs', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  image: varchar('image'),
  status: boolean('status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  status: boolean('status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const types = pgTable('types', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  status: boolean('status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  brandId: serial('brand_id')
    .notNull()
    .references(() => brands.id),
  typesId: serial('types_id')
    .notNull()
    .references(() => types.id),
  name: varchar('name').notNull(),
  description: varchar('description'),
  image: varchar('image'),
  sku: varchar('sku'),
  salePrice: decimal('sale_price', { scale: 0 }),
  supplierPrice: decimal('supplier_price', { scale: 0 }),
  wholesalePrice: decimal('wholesale_price', { scale: 0 }),
  retailPrice: decimal('retail_price', { scale: 0 }),
  workshopPrice: decimal('workshop_price', { scale: 0 }),
  status: boolean('status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const productRelations = relations(products, ({ one }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  type: one(types, {
    fields: [products.typesId],
    references: [types.id],
  }),
}));

export const productCategories = pgTable(
  'product_categories',
  {
    productId: serial('product_id')
      .notNull()
      .references(() => products.id),
    categoryId: serial('category_id')
      .notNull()
      .references(() => categories.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.categoryId] }),
  })
);

export const productCategoryRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.id],
    }),
  })
);

export const productStocks = pgTable('product_stocks', {
  id: serial('id').primaryKey(),
  productId: serial('product_id')
    .notNull()
    .references(() => products.id),
  storeId: serial('store_id')
    .notNull()
    .references(() => stores.id),
  shelfId: serial('shelf_id').references(() => shelfs.id),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const productStockRelations = relations(productStocks, ({ one }) => ({
  product: one(products, {
    fields: [productStocks.productId],
    references: [products.id],
  }),
  store: one(stores, {
    fields: [productStocks.storeId],
    references: [stores.id],
  }),
  shelf: one(shelfs, {
    fields: [productStocks.shelfId],
    references: [shelfs.id],
  }),
}));

export const productStockLogs = pgTable('product_stock_logs', {
  id: serial('id').primaryKey(),
  productId: serial('product_id')
    .notNull()
    .references(() => products.id),
  storeId: serial('store_id')
    .notNull()
    .references(() => stores.id),
  shelfId: serial('shelf_id').references(() => shelfs.id),
  stockBefore: integer('stock_before').notNull().default(0),
  stock: integer('stock').notNull().default(0),
  description: varchar('description'),
  status: integer('status').notNull().default(0), // 0: in, 1: out, 2: adjust
  createdAt: timestamp('created_at').defaultNow(),
});

export const productStockLogRelations = relations(
  productStockLogs,
  ({ one }) => ({
    product: one(products, {
      fields: [productStockLogs.productId],
      references: [products.id],
    }),
    store: one(stores, {
      fields: [productStockLogs.storeId],
      references: [stores.id],
    }),
    shelf: one(shelfs, {
      fields: [productStockLogs.shelfId],
      references: [shelfs.id],
    }),
  })
);

export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  contactPerson: varchar('contact_person'),
  email: varchar('email'),
  phone: varchar('phone'),
  address: varchar('address'),
  description: varchar('description'),
  status: boolean('status'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const goodsReceipts = pgTable('goods_receipts', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: bigserial('user_id', { mode: 'bigint' })
    .notNull()
    .references(() => users.id),
  supplierId: serial('supplier_id')
    .notNull()
    .references(() => suppliers.id),
  goodsReceiptDate: timestamp('goods_receipt_date').defaultNow(),
  notes: varchar('notes'),
  attachment: varchar('attachment'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const goodsReceiptItems = pgTable('goods_receipt_items', {
  id: serial('id').primaryKey(),
  goodsReceiptId: varchar('goods_receipt_id', { length: 36 })
    .notNull()
    .references(() => goodsReceipts.id),
  productId: serial('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { scale: 0 }).notNull(),
  total: decimal('total', { scale: 0 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const goodsReceiptRelations = relations(
  goodsReceipts,
  ({ one, many }) => ({
    user: one(users, {
      fields: [goodsReceipts.userId],
      references: [users.id],
    }),
    supplier: one(suppliers, {
      fields: [goodsReceipts.supplierId],
      references: [suppliers.id],
    }),
    items: many(goodsReceiptItems),
  })
);

export const goodsReceiptItemRelations = relations(
  goodsReceiptItems,
  ({ one }) => ({
    goodsReceipt: one(goodsReceipts, {
      fields: [goodsReceiptItems.goodsReceiptId],
      references: [goodsReceipts.id],
    }),
    product: one(products, {
      fields: [goodsReceiptItems.productId],
      references: [products.id],
    }),
  })
);

export const stockTransfers = pgTable('stock_transfers', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: bigserial('user_id', { mode: 'bigint' })
    .notNull()
    .references(() => users.id),
  fromStoreId: serial('from_store_id')
    .notNull()
    .references(() => stores.id),
  toStoreId: serial('to_store_id')
    .notNull()
    .references(() => stores.id),
  fromShelfId: serial('from_shelf_id').references(() => shelfs.id),
  toShelfId: serial('to_shelf_id').references(() => shelfs.id),
  attachment: varchar('attachment'),
  status: integer('status').notNull().default(0), // 0: pending, 1: approved, 2: rejected
  notes: varchar('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const stockTransferItems = pgTable('stock_transfer_items', {
  id: serial('id').primaryKey(),
  stockTransferId: varchar('stock_transfer_id', { length: 36 })
    .notNull()
    .references(() => stockTransfers.id),
  productId: serial('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  status: integer('status').notNull().default(0), // 0: pending, 1: approved, 2: rejected
  createdAt: timestamp('created_at').defaultNow(),
});

export const stockTransferRelations = relations(
  stockTransfers,
  ({ one, many }) => ({
    user: one(users, {
      fields: [stockTransfers.userId],
      references: [users.id],
    }),
    fromStore: one(stores, {
      fields: [stockTransfers.fromStoreId],
      references: [stores.id],
    }),
    toStore: one(stores, {
      fields: [stockTransfers.toStoreId],
      references: [stores.id],
    }),
    fromShelf: one(shelfs, {
      fields: [stockTransfers.fromShelfId],
      references: [shelfs.id],
    }),
    toShelf: one(shelfs, {
      fields: [stockTransfers.toShelfId],
      references: [shelfs.id],
    }),
    items: many(stockTransferItems),
  })
);

export const stockTransferItemRelations = relations(
  stockTransferItems,
  ({ one }) => ({
    stockTransfer: one(stockTransfers, {
      fields: [stockTransferItems.stockTransferId],
      references: [stockTransfers.id],
    }),
    product: one(products, {
      fields: [stockTransferItems.productId],
      references: [products.id],
    }),
  })
);

// pengeluaran barang

export const productExpenditures = pgTable('product_expenditures', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: bigserial('user_id', { mode: 'bigint' })
    .notNull()
    .references(() => users.id),
  storeId: serial('store_id')
    .notNull()
    .references(() => stores.id),
  shelfId: serial('shelf_id').references(() => shelfs.id),
  attachment: varchar('attachment'),
  notes: varchar('notes'),
  status: integer('status').notNull().default(0), // 0: pending, 1: approved, 2: rejected
  createdAt: timestamp('created_at').defaultNow(),
});

export const productExpenditureItems = pgTable('product_expenditure_items', {
  id: serial('id').primaryKey(),
  productExpenditureId: varchar('product_expenditure_id', { length: 36 })
    .notNull()
    .references(() => productExpenditures.id),
  productId: serial('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  status: integer('status').notNull().default(0), // 0: pending, 1: approved, 2: rejected
  createdAt: timestamp('created_at').defaultNow(),
});

export const productExpenditureRelations = relations(
  productExpenditures,
  ({ one, many }) => ({
    user: one(users, {
      fields: [productExpenditures.userId],
      references: [users.id],
    }),
    store: one(stores, {
      fields: [productExpenditures.storeId],
      references: [stores.id],
    }),
    items: many(productExpenditureItems),
  })
);

export const productExpenditureItemRelations = relations(
  productExpenditureItems,
  ({ one }) => ({
    productExpenditure: one(productExpenditures, {
      fields: [productExpenditureItems.productExpenditureId],
      references: [productExpenditures.id],
    }),
    product: one(products, {
      fields: [productExpenditureItems.productId],
      references: [products.id],
    }),
  })
);

// penyesuaian stok
export const stockAdjustments = pgTable('stock_adjustments', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: bigserial('user_id', { mode: 'bigint' })
    .notNull()
    .references(() => users.id),
  storeId: serial('store_id')
    .notNull()
    .references(() => stores.id),
  shelfId: serial('shelf_id').references(() => shelfs.id),
  notes: varchar('notes'),
  status: integer('status').notNull().default(0), // 0: pending, 1: approved, 2: rejected
  createdAt: timestamp('created_at').defaultNow(),
});

export const stockAdjustmentItems = pgTable('stock_adjustment_items', {
  id: serial('id').primaryKey(),
  stockAdjustmentId: varchar('stock_adjustment_id', { length: 36 })
    .notNull()
    .references(() => stockAdjustments.id),
  productId: serial('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  status: integer('status').notNull().default(0), // 0: pending, 1: approved, 2: rejected
  createdAt: timestamp('created_at').defaultNow(),
});

export const stockAdjustmentRelations = relations(
  stockAdjustments,
  ({ one, many }) => ({
    user: one(users, {
      fields: [stockAdjustments.userId],
      references: [users.id],
    }),
    store: one(stores, {
      fields: [stockAdjustments.storeId],
      references: [stores.id],
    }),
    shelf: one(shelfs, {
      fields: [stockAdjustments.shelfId],
      references: [shelfs.id],
    }),
    items: many(stockAdjustmentItems),
  })
);

export const stockAdjustmentItemRelations = relations(
  stockAdjustmentItems,
  ({ one }) => ({
    stockAdjustment: one(stockAdjustments, {
      fields: [stockAdjustmentItems.stockAdjustmentId],
      references: [stockAdjustments.id],
    }),
    product: one(products, {
      fields: [stockAdjustmentItems.productId],
      references: [products.id],
    }),
  })
);
