import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';
import { accounts, roles, TSelectUserSchema, userRoles, users } from './schema';
import Credentials from 'next-auth/providers/credentials';
import { eq } from 'drizzle-orm';
import { loginSchema } from './validations';
import { comparePassword } from './hash';
import { Adapter } from 'next-auth/adapters';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        const validate = loginSchema.safeParse(credentials);

        if (!validate.success) {
          throw new Error('Email atau password salah');
        }

        const { email, password } = validate.data;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (!user) {
          throw new Error('Email atau password salah');
        }

        if (!comparePassword(password, user.password)) {
          throw new Error('Email atau password salah');
        }

        const userRolesData = await db
          .select()
          .from(userRoles)
          .innerJoin(roles, eq(roles.id, userRoles.roleId))
          .where(eq(userRoles.userId, user.id))
          .groupBy(userRoles.roleId);

        let userData = users as any;
        userData.roles = userRolesData.map((role) => role.roles);
        userData.roleIds = userRolesData.map((role) => role.roles.id);

        const { password: _, ...userWithoutPassword } = userData;

        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === 'update') {
        const id = BigInt(token.id);
        const [userData] = await db
          .select()
          .from(users)
          .where(eq(users.id, id));

        token.name = userData?.name;
        token.email = userData?.email;
        token.image = userData?.image;
      }

      if (user) {
        return {
          ...token,
          id: parseInt(user.id as string),
          roleIds: user.roleIds,
          roles: user.roles,
          joinDate: user.joinDate,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session?.user) {
        return {
          ...session,
          user: {
            ...session.user,
            roleIds: token.roleIds,
            roles: token.roles,
            joinDate: token.joinDate,
            name: token.name,
            email: token.email,
            image: token.image as string | null,
          },
        };
      }
      return session;
    },
  },
});
