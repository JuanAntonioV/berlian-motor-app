import { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from './validations';
import { roles, userRoles, users } from './schema';
import { db } from './db';
import { comparePassword } from './hash';
import { eq } from 'drizzle-orm';
import { ZodError } from 'zod';

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .then((data) => data[0]);

          if (!user) {
            throw new Error('Email atau password salah');
          }

          const passwordValid = await comparePassword(password, user.password);

          if (!passwordValid) {
            throw new Error('Email atau password salah');
          }

          const userRolesData = await db
            .select()
            .from(userRoles)
            .innerJoin(roles, eq(roles.id, userRoles.roleId))
            .where(eq(userRoles.userId, user.id));

          let userData = {
            ...user,
            roleIds: [],
            roles: [],
          } as any;

          userData.roles = userRolesData.map((role) => role.roles);
          userData.roleIds = userRolesData.map((role) => role.roles.id);

          const { password: _, ...userWithoutPassword } = userData;

          return userWithoutPassword;
        } catch (error: any) {
          if (error instanceof ZodError) {
            throw new Error('Email atau password salah');
          }

          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === 'update') {
        const id = token.id;
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
          id: String(user.id),
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
            id: token.id,
            name: token.name,
            email: token.email,
            image: token.image as string | null,
          },
        };
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
