import { TMenu } from './types';

export const protectedRoutes = [
  '/',
  '/dashboard',
  '/akun-saya',
  '/kelola-karyawan',
  '/kelola-kategori',
  '/kelola-merek',
  '/kelola-produk',
  '/kelola-rak',
];

export const unprotectedRoutes = ['/auth/login'];
