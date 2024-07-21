import { Prisma, Roles, UserWithRoles } from '@prisma/client';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { TSelectRoleSchema } from './lib/schema';

declare module 'next-auth' {
  interface Session {
    id: string;
  }

  interface User {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    qw;
  }
}
