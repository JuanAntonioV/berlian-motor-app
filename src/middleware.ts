import { NextRequest, NextResponse } from 'next/server';
import { protectedRoutes, unprotectedRoutes } from './constants';
import { cookies } from 'next/headers';
import { decrypt } from './lib/session';

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const isProtectedRoute = protectedRoutes.some((prefix) =>
    nextUrl.pathname.startsWith(prefix)
  );

  const cookie = cookies().get('session')?.value as string;
  const session = await decrypt(cookie);
  const isAuth = session?.userId;

  if (isProtectedRoute && !isAuth) {
    const absoluteURL = new URL('/auth/login', nextUrl.origin);
    return NextResponse.rewrite(absoluteURL.toString());
  }

  if (unprotectedRoutes.includes(nextUrl.pathname) && isAuth) {
    const absoluteURL = new URL('/dashboard', nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
