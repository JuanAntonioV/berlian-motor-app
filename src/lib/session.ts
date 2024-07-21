import 'server-only';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import config from './config';
import { DateTime } from 'luxon';
import { cookies } from 'next/headers';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { redirect } from 'next/navigation';

const key = new TextEncoder().encode(process.env.AUTH_SECRET);

const cookieOptions = {
  name: 'session',
  options: {
    httpOnly: true,
    secure: process.env.APP_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
  duration: 24 * 60 * 60 * 1000,
};

export async function ecrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}
export async function decrypt(session: string | Uint8Array) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string) {
  const expires = DateTime.now().plus({ milliseconds: cookieOptions.duration });
  const session = await ecrypt({ userId, expires: expires.toISO() });

  cookies().set(cookieOptions.name, session, {
    httpOnly: true,
    secure: process.env.APP_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expires.toJSDate(),
  });

  redirect('/dashboard');
}

export async function verifySession() {
  const cookie = cookies().get(cookieOptions.name)?.value as string;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return null;
  }

  return { userId: session.userId };
}
export async function deleteSession() {
  cookies().delete(cookieOptions.name);
  redirect('/auth/login');
}
