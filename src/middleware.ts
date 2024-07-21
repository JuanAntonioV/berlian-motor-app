import NextAuth from 'next-auth';
import authConfig from './lib/authConfig';
import { NextRequest, NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

const protectedRoutes = [
  '/',
  '/dashboard',
  '/akun-saya',
  '/kelola-karyawan',
  '/kelola-kategori',
  '/kelola-merek',
  '/kelola-produk',
  '/kelola-rak',
];

const unprotectedRoutes = ['/auth/login'];

async function middleware(req: any) {
  const { auth, nextUrl } = req;

  const user = auth?.user;

  const isProtectedRoute = protectedRoutes.some((prefix) =>
    nextUrl.pathname.startsWith(prefix)
  );

  if (!user && isProtectedRoute) {
    const absoluteURL = new URL('/auth/login', nextUrl.origin);
    return NextResponse.rewrite(absoluteURL.toString());
  }
  if (user && unprotectedRoutes.includes(nextUrl.pathname)) {
    const absoluteURL = new URL('/dashboard', nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

export default auth(middleware);
