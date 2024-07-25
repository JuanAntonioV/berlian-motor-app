'use server';

import { db } from '@/lib/db';
import {
  goodsReceiptItems,
  productExpenditureItems,
  products,
  productStocks,
} from '@/lib/schema';
import { TStatItem } from '@/types';
import { count, sum } from 'drizzle-orm';

export async function getDashboardStats() {
  try {
    const [totalStocks] = await db
      .select({ total: sum(productStocks.stock) })
      .from(productStocks);
    const [totalStockIn] = await db
      .select({ total: sum(goodsReceiptItems.quantity) })
      .from(goodsReceiptItems);
    const [totalStockOut] = await db
      .select({ total: sum(productExpenditureItems.quantity) })
      .from(productExpenditureItems);
    const [totalProducts] = await db
      .select({ total: count(products.id) })
      .from(products);

    const stats: TStatItem[] = [
      {
        id: 'total-stock',
        name: 'Total Stok',
        value: totalStocks.total || 0,
        description: 'Dari keseluruhan',
        type: 'number',
      },
      {
        id: 'total-stock-in',
        name: 'Total Stok Masuk',
        value: totalStockIn.total || 0,
        description: 'Dari keseluruhan',
        type: 'number',
      },
      {
        id: 'total-stock-out',
        name: 'Total Stok Keluar',
        value: totalStockOut.total || 0,
        description: 'Dari keseluruhan',
        type: 'number',
      },
      {
        id: 'total-product',
        name: 'Total Produk',
        value: totalProducts.total || 0,
        description: 'Dari keseluruhan',
        type: 'number',
      },
    ];

    return stats;
  } catch (err) {
    console.error(err);
  }
}
