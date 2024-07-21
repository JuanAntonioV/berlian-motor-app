import { Prisma, Roles, UserWithRoles } from '@prisma/client';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { TSelectRoleSchema } from './lib/schema';

declare module 'next-auth' {
  interface Session {
    id: number;
    roles: TSelectRoleSchema[];
    roleIds: number[];
    joinDate: Date;
  }

  interface User {
    id: number;
    roles: TSelectRoleSchema[];
    roleIds: number[];
    joinDate: Date;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    qw;
    roles: TSelectRoleSchema[];
    roleIds: number[];
    joinDate: Date;
  }
}
