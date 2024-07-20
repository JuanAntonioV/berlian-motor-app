import { DB } from '../db';
import { TCreatePermissionSchema, permissions } from '../schema';

export async function seed(db: DB) {
  const permissionsData = [
    {
      name: 'Kelola Karyawan',
      description: 'Mengelola data karyawan',
    },
    {
      name: 'Kelola Produk',
      description: 'Mengelola data produk',
    },
    {
      name: 'Kelola Peran',
      description: 'Mengelola data peran',
    },
    {
      name: 'Kelola Hak Akses',
      description: 'Mengelola data hak akses',
    },
    {
      name: 'Kelola Toko',
      description: 'Mengelola data toko',
    },
    {
      name: 'Kelola Tipe',
      description: 'Mengelola data tipe',
    },
    {
      name: 'Kelola Kategori',
      description: 'Mengelola data kategori',
    },
    {
      name: 'Kelola Rak',
      description: 'Mengelola data rak',
    },
    {
      name: 'Kelola Karyawan Toko',
      description: 'Mengelola data karyawan toko',
    },
    {
      name: 'Penerimaan Barang',
      description: 'Mengelola data penerimaan barang',
    },
    {
      name: 'Pengeluaran Barang',
      description: 'Mengelola data pengeluaran barang',
    },
    {
      name: 'Transfer Barang',
      description: 'Mengelola data transfer barang antar toko atau rak',
    },
    {
      name: 'Penyesuaian Stok',
      description: 'Mengelola data penyesuaian stok',
    },
  ];

  await db.insert(permissions).values(permissionsData);
}
