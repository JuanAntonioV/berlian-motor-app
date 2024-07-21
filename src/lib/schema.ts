import { InferSelectModel, relations, sql } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  decimal,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import type { AdapterAccountType } from 'next-auth/adapters';
import { z } from 'zod';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  password: varchar('password').notNull(),
  status: boolean('status').notNull().default(true),
  joinDate: timestamp('join_date', { mode: 'date' }).defaultNow(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }).defaultNow(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

const baseUserSchema = createInsertSchema(users, {
  name: (schema) => schema.name.min(1, 'Nama tidak boleh kosong'),
  email: (schema) => schema.email.email('Email tidak valid'),
  password: (schema) => schema.password.min(6, 'Password minimal 6 karakter'),
  status: (schema) => schema.status.default(true),
}).pick({
  name: true,
  email: true,
  password: true,
  status: true,
});

export const createUserSchema = z
  .object({
    ...baseUserSchema.shape,
    id: z.undefined(),
    confirmPassword: z.string(),
    roles: z.array(z.number()),
    permissions: z.array(z.number()),
    stores: z.array(z.number()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
  });

export const updateUserSchema = z.object({
  id: z.number().int().positive(),
  name: baseUserSchema.shape.name,
  email: baseUserSchema.shape.email,
  status: baseUserSchema.shape.status,
  roles: z.array(z.number()),
  permissions: z.array(z.number()),
  stores: z.array(z.number()),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;
export type TUpdateUserSchema = z.infer<typeof updateUserSchema>;
export type TSelectUserSchema = InferSelectModel<typeof users>;

export const userStores = pgTable('user_stores', {
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  storeId: serial('store_id')
    .notNull()
    .references(() => stores.id, { onDelete: 'cascade' }),
});

export const userStoreRelations = relations(userStores, ({ one }) => ({
  user: one(users, {
    fields: [userStores.userId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [userStores.storeId],
    references: [stores.id],
  }),
}));

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseRoleSchema = createInsertSchema(roles, {
  name: (schema) => schema.name.min(1, 'Nama tidak boleh kosong'),
}).pick({
  name: true,
  description: true,
});

export const createRoleSchema = z.object({
  ...baseRoleSchema.shape,
  permissions: z.array(z.number()),
});

export const updateRoleSchema = z.object({
  id: z.number().int().positive(),
  ...baseRoleSchema.shape,
  permissions: z.array(z.number()),
});

export type TCreateRoleSchema = z.infer<typeof createRoleSchema>;
export type TUpdateRoleSchema = z.infer<typeof updateRoleSchema>;
export type TSelectRoleSchema = InferSelectModel<typeof roles>;

export const userRoles = pgTable(
  'user_roles',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: serial('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
  })
);

export const userRelations = relations(users, ({ many, one }) => ({
  userStores: many(userStores),
  userRoles: many(userRoles),
  userPermissions: many(userPermissions),
  goodsReceipts: many(goodsReceipts),
  productExpenditures: many(productExpenditures),
  stockAdjustments: many(stockAdjustments),
  stockTransfers: many(stockTransfers),
}));

export const roleRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
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

const basePermissionSchema = createInsertSchema(permissions, {
  name: (schema) => schema.name.min(1, 'Nama tidak boleh kosong'),
}).pick({
  name: true,
  description: true,
});

export const createPermissionSchema = z.object(basePermissionSchema.shape);

export const updatePermissionSchema = z.object({
  id: z.number().int().positive(),
  ...basePermissionSchema.shape,
});

export type TCreatePermissionSchema = z.infer<typeof createPermissionSchema>;
export type TUpdatePermissionSchema = z.infer<typeof updatePermissionSchema>;
export type TSelectPermissionSchema = InferSelectModel<typeof permissions>;

export const rolePermissions = pgTable('role_permissions', {
  id: serial('id').primaryKey(),
  roleId: serial('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: serial('permission_id')
    .notNull()
    .references(() => permissions.id, { onDelete: 'cascade' }),
});

export const permissionRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  userPermissions: many(userPermissions),
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
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    permissionId: serial('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
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
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseBrandSchema = createInsertSchema(brands, {
  name: (schema) => schema.name.min(1, 'Nama tidak boleh kosong'),
}).pick({
  name: true,
  status: true,
});

export const createBrandSchema = z.object(baseBrandSchema.shape);

export const updateBrandSchema = z.object({
  id: z.number().int().positive(),
  ...baseBrandSchema.shape,
});

export type TCreateBrandSchema = z.infer<typeof createBrandSchema>;
export type TUpdateBrandSchema = z.infer<typeof updateBrandSchema>;
export type TSelectBrandSchema = InferSelectModel<typeof brands>;

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.name.min(1, 'Nama tidak boleh kosong'),
}).pick({
  name: true,
  status: true,
});

export const createCategorySchema = z.object(baseCategorySchema.shape);

export const updateCategorySchema = z.object({
  id: z.number().int().positive(),
  ...baseCategorySchema.shape,
});

export type TCreateCategorySchema = z.infer<typeof createCategorySchema>;
export type TUpdateCategorySchema = z.infer<typeof updateCategorySchema>;
export type TSelectCategorySchema = InferSelectModel<typeof categories>;

export const shelfs = pgTable('shelfs', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull().unique(),
  description: varchar('description'),
  image: varchar('image'),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

export const storeShelfs = pgTable(
  'store_shelfs',
  {
    storeId: serial('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    shelfId: serial('shelf_id')
      .notNull()
      .references(() => shelfs.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.storeId, t.shelfId] }),
  })
);

export const shelfRelations = relations(shelfs, ({ many }) => ({
  storeShelfs: many(storeShelfs),
  productStocks: many(productStocks),
}));

export const storeShelfRelations = relations(storeShelfs, ({ one }) => ({
  store: one(stores, {
    fields: [storeShelfs.storeId],
    references: [stores.id],
  }),
  shelf: one(shelfs, {
    fields: [storeShelfs.shelfId],
    references: [shelfs.id],
  }),
}));

const baseShelfSchema = createInsertSchema(shelfs, {
  name: (schema) => schema.name.min(1, 'Nama tidak boleh kosong'),
}).pick({
  name: true,
  description: true,
  image: true,
  status: true,
});

export const createShelfSchema = z.object({
  ...baseShelfSchema.shape,
  storeId: z.number().int().positive(),
});

export const updateShelfSchema = z.object({
  id: z.number().int().positive(),
  ...baseShelfSchema.shape,
  storeId: z.number().int().positive(),
});

export type TCreateShelfSchema = z.infer<typeof createShelfSchema>;
export type TUpdateShelfSchema = z.infer<typeof updateShelfSchema>;
export type TSelectShelfSchema = InferSelectModel<typeof shelfs>;

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull().unique(),
  description: varchar('description'),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseStoreSchema = createInsertSchema(stores, {
  name: (schema) => schema.name.min(1, 'Nama tidak boleh kosong'),
}).pick({
  name: true,
  description: true,
  status: true,
});

export const createStoreSchema = z.object(baseStoreSchema.shape);

export const updateStoreSchema = z.object({
  id: z.number().int().positive(),
  ...baseStoreSchema.shape,
});

export type TCreateStoreSchema = z.infer<typeof createStoreSchema>;
export type TUpdateStoreSchema = z.infer<typeof updateStoreSchema>;
export type TSelectStoreSchema = InferSelectModel<typeof stores>;

export const types = pgTable('types', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull().unique(),
  description: varchar('description'),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseTypeSchema = createInsertSchema(types, {
  name: (schema) => schema.name.min(1, 'Nama tidak boleh kosong'),
}).pick({
  name: true,
  description: true,
  status: true,
});

export const createTypeSchema = z.object(baseTypeSchema.shape);

export const updateTypeSchema = z.object({
  id: z.number().int().positive(),
  ...baseTypeSchema.shape,
});

export type TCreateTypeSchema = z.infer<typeof createTypeSchema>;
export type TUpdateTypeSchema = z.infer<typeof updateTypeSchema>;
export type TSelectTypeSchema = InferSelectModel<typeof types>;

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  brandId: serial('brand_id')
    .notNull()
    .references(() => brands.id, { onDelete: 'cascade' }),
  typesId: serial('types_id')
    .notNull()
    .references(() => types.id, { onDelete: 'cascade' }),
  name: varchar('name').notNull(),
  description: varchar('description'),
  image: varchar('image'),
  sku: varchar('sku'),
  salePrice: decimal('sale_price', { scale: 0 }),
  supplierPrice: decimal('supplier_price', { scale: 0 }),
  wholesalePrice: decimal('wholesale_price', { scale: 0 }),
  retailPrice: decimal('retail_price', { scale: 0 }),
  workshopPrice: decimal('workshop_price', { scale: 0 }),
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseProductSchema = createInsertSchema(products, {
  name: (schema) => schema.name.min(1, 'Nama tidak boleh kosong'),
  salePrice: (schema) =>
    schema.salePrice.min(1, 'Harga jual tidak boleh kosong'),
  supplierPrice: (schema) =>
    schema.supplierPrice.min(1, 'Harga supplier tidak boleh kosong'),
  wholesalePrice: (schema) =>
    schema.wholesalePrice.min(1, 'Harga grosir tidak boleh kosong'),
  retailPrice: (schema) =>
    schema.retailPrice.min(1, 'Harga eceran tidak boleh kosong'),
  workshopPrice: (schema) =>
    schema.workshopPrice.min(1, 'Harga bengkel tidak boleh kosong'),
}).pick({
  brandId: true,
  typesId: true,
  name: true,
  description: true,
  image: true,
  sku: true,
  salePrice: true,
  supplierPrice: true,
  wholesalePrice: true,
  retailPrice: true,
  workshopPrice: true,
  status: true,
});

export const createProductSchema = z.object({
  ...baseProductSchema.shape,
  categories: z.array(z.number()),
});

export const updateProductSchema = z.object({
  id: z.number().int().positive(),
  ...baseProductSchema.shape,
  categories: z.array(z.number()),
});

export type TCreateProductSchema = z.infer<typeof createProductSchema>;
export type TUpdateProductSchema = z.infer<typeof updateProductSchema>;
export type TSelectProductSchema = InferSelectModel<typeof products>;

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
      .references(() => products.id, { onDelete: 'cascade' }),
    categoryId: serial('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
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
    .references(() => products.id, { onDelete: 'cascade' }),
  storeId: serial('store_id')
    .notNull()
    .references(() => stores.id, { onDelete: 'cascade' }),
  shelfId: serial('shelf_id')
    .notNull()
    .references(() => shelfs.id, {
      onDelete: 'cascade',
    }),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseProductStockSchema = createInsertSchema(productStocks, {
  stock: (schema) => schema.stock.min(0, 'Stok tidak boleh negatif'),
  productId: (schema) => schema.productId.min(1, 'Produk tidak boleh kosong'),
  storeId: (schema) => schema.storeId.min(1, 'Toko tidak boleh kosong'),
  shelfId: (schema) => schema.shelfId.min(1, 'Rak tidak boleh kosong'),
}).pick({
  productId: true,
  storeId: true,
  shelfId: true,
  stock: true,
});

export const createProductStockSchema = z.object(baseProductStockSchema.shape);

export const updateProductStockSchema = z.object({
  id: z.number().int().positive(),
  ...baseProductStockSchema.shape,
});

export type TCreateProductStockSchema = z.infer<
  typeof createProductStockSchema
>;
export type TUpdateProductStockSchema = z.infer<
  typeof updateProductStockSchema
>;
export type TSelectProductStockSchema = InferSelectModel<typeof productStocks>;

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
  shelfId: serial('shelf_id')
    .notNull()
    .references(() => shelfs.id),
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
  status: boolean('status').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseSupplierSchema = createInsertSchema(suppliers, {
  name: (schema) => schema.name.min(1, 'Nama tidak boleh kosong'),
}).pick({
  name: true,
  contactPerson: true,
  email: true,
  phone: true,
  address: true,
  description: true,
  status: true,
});

export const createSupplierSchema = z.object(baseSupplierSchema.shape);

export const updateSupplierSchema = z.object({
  id: z.number().int().positive(),
  ...baseSupplierSchema.shape,
});

export type TCreateSupplierSchema = z.infer<typeof createSupplierSchema>;
export type TUpdateSupplierSchema = z.infer<typeof updateSupplierSchema>;
export type TSelectSupplierSchema = InferSelectModel<typeof suppliers>;

export const goodsReceipts = pgTable('goods_receipts', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  supplierId: serial('supplier_id')
    .notNull()
    .references(() => suppliers.id),
  shelfId: serial('shelf_id')
    .notNull()
    .references(() => shelfs.id),
  goodsReceiptDate: timestamp('goods_receipt_date', {
    mode: 'date',
  }).defaultNow(),
  notes: varchar('notes'),
  attachment: varchar('attachment'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseGoodsReceiptSchema = createInsertSchema(goodsReceipts, {
  userId: (schema) => schema.userId.min(1, 'User tidak boleh kosong'),
  supplierId: (schema) =>
    schema.supplierId.min(1, 'Supplier tidak boleh kosong'),
  shelfId: (schema) => schema.shelfId.min(1, 'Rak tidak boleh kosong'),
}).pick({
  userId: true,
  supplierId: true,
  shelfId: true,
  goodsReceiptDate: true,
  notes: true,
  attachment: true,
});

export const createGoodsReceiptSchema = z.object({
  ...baseGoodsReceiptSchema.shape,
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
      price: z.number().int().positive(),
    })
  ),
});

export const updateGoodsReceiptSchema = z.object({
  id: z.string(),
  ...baseGoodsReceiptSchema.shape,
  items: z.array(
    z.object({
      id: z.number().int().positive(),
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
      price: z.number().int().positive(),
    })
  ),
});

export type TCreateGoodsReceiptSchema = z.infer<
  typeof createGoodsReceiptSchema
>;
export type TUpdateGoodsReceiptSchema = z.infer<
  typeof updateGoodsReceiptSchema
>;
export type TSelectGoodsReceiptSchema = InferSelectModel<typeof goodsReceipts>;

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
    shelf: one(shelfs, {
      fields: [goodsReceipts.shelfId],
      references: [shelfs.id],
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
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  fromStoreId: serial('from_store_id')
    .notNull()
    .references(() => stores.id, { onDelete: 'cascade' }),
  toStoreId: serial('to_store_id')
    .notNull()
    .references(() => stores.id, { onDelete: 'cascade' }),
  fromShelfId: serial('from_shelf_id')
    .notNull()
    .references(() => shelfs.id, { onDelete: 'cascade' }),
  toShelfId: serial('to_shelf_id')
    .notNull()
    .references(() => shelfs.id, { onDelete: 'cascade' }),
  attachment: varchar('attachment'),
  status: integer('status').notNull().default(0), // 0: pending, 1: approved, 2: rejected
  notes: varchar('notes'),
  transferDate: timestamp('transfer_date', {
    mode: 'date',
  }).defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseStockTransferSchema = createInsertSchema(stockTransfers, {
  userId: (schema) => schema.userId.min(1, 'User tidak boleh kosong'),
  fromStoreId: (schema) =>
    schema.fromStoreId.min(1, 'Toko asal tidak boleh kosong'),
  toStoreId: (schema) =>
    schema.toStoreId.min(1, 'Toko tujuan tidak boleh kosong'),
  fromShelfId: (schema) =>
    schema.fromShelfId.min(1, 'Rak asal tidak boleh kosong'),
  toShelfId: (schema) =>
    schema.toShelfId.min(1, 'Rak tujuan tidak boleh kosong'),
}).pick({
  userId: true,
  fromStoreId: true,
  toStoreId: true,
  fromShelfId: true,
  toShelfId: true,
  attachment: true,
  status: true,
  notes: true,
});

export const createStockTransferSchema = z.object({
  ...baseStockTransferSchema.shape,
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

export const updateStockTransferSchema = z.object({
  id: z.string(),
  ...baseStockTransferSchema.shape,
  items: z.array(
    z.object({
      id: z.number().int().positive(),
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

export type TCreateStockTransferSchema = z.infer<
  typeof createStockTransferSchema
>;
export type TUpdateStockTransferSchema = z.infer<
  typeof updateStockTransferSchema
>;
export type TSelectStockTransferSchema = InferSelectModel<
  typeof stockTransfers
>;

export const stockTransferItems = pgTable('stock_transfer_items', {
  id: serial('id').primaryKey(),
  stockTransferId: varchar('stock_transfer_id', { length: 36 })
    .notNull()
    .references(() => stockTransfers.id, { onDelete: 'cascade' }),
  productId: serial('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
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
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  shelfId: serial('shelf_id')
    .notNull()
    .references(() => shelfs.id, { onDelete: 'cascade' }),
  attachment: varchar('attachment'),
  notes: varchar('notes'),
  status: integer('status').notNull().default(0), // 0: pending, 1: approved, 2: rejected
  expenditureDate: timestamp('expenditure_date', {
    mode: 'date',
  }).defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseProductExpenditureSchema = createInsertSchema(productExpenditures, {
  userId: (schema) => schema.userId.min(1, 'User tidak boleh kosong'),
  shelfId: (schema) => schema.shelfId.min(1, 'Rak tidak boleh kosong'),
}).pick({
  userId: true,
  shelfId: true,
  attachment: true,
  notes: true,
  status: true,
});

export const createProductExpenditureSchema = z.object({
  ...baseProductExpenditureSchema.shape,
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

export const updateProductExpenditureSchema = z.object({
  id: z.string(),
  ...baseProductExpenditureSchema.shape,
  items: z.array(
    z.object({
      id: z.number().int().positive(),
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

export type TCreateProductExpenditureSchema = z.infer<
  typeof createProductExpenditureSchema
>;
export type TUpdateProductExpenditureSchema = z.infer<
  typeof updateProductExpenditureSchema
>;
export type TSelectProductExpenditureSchema = InferSelectModel<
  typeof productExpenditures
>;

export const productExpenditureItems = pgTable('product_expenditure_items', {
  id: serial('id').primaryKey(),
  productExpenditureId: varchar('product_expenditure_id', { length: 36 })
    .notNull()
    .references(() => productExpenditures.id, { onDelete: 'cascade' }),
  productId: serial('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
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
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  shelfId: serial('shelf_id')
    .notNull()
    .references(() => shelfs.id, { onDelete: 'cascade' }),
  notes: varchar('notes'),
  status: integer('status').notNull().default(0), // 0: pending, 1: approved, 2: rejected
  adjustmentDate: timestamp('adjustment_date', {
    mode: 'date',
  }).defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`),
});

const baseStockAdjustmentSchema = createInsertSchema(stockAdjustments, {
  userId: (schema) => schema.userId.min(1, 'User tidak boleh kosong'),
  shelfId: (schema) => schema.shelfId.min(1, 'Rak tidak boleh kosong'),
}).pick({
  userId: true,
  shelfId: true,
  notes: true,
  status: true,
});

export const createStockAdjustmentSchema = z.object({
  ...baseStockAdjustmentSchema.shape,
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

export const updateStockAdjustmentSchema = z.object({
  id: z.string(),
  ...baseStockAdjustmentSchema.shape,
  items: z.array(
    z.object({
      id: z.number().int().positive(),
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

export type TCreateStockAdjustmentSchema = z.infer<
  typeof createStockAdjustmentSchema
>;
export type TUpdateStockAdjustmentSchema = z.infer<
  typeof updateStockAdjustmentSchema
>;
export type TSelectStockAdjustmentSchema = InferSelectModel<
  typeof stockAdjustments
>;

export const stockAdjustmentItems = pgTable('stock_adjustment_items', {
  id: serial('id').primaryKey(),
  stockAdjustmentId: varchar('stock_adjustment_id', { length: 36 })
    .notNull()
    .references(() => stockAdjustments.id),
  productId: serial('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
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
