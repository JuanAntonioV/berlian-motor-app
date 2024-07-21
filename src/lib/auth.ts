import NextAuth from 'next-auth';
import authConfig from './authConfig';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import { accounts, sessions, users } from './schema';
import { Adapter } from 'next-auth/adapters';
import config from './config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    sessionsTable: sessions,
    accountsTable: accounts,
  }) as Adapter,
  secret: config.AUTH_SECRET,
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  ...authConfig,
});
