'use server';

import { db } from '@/lib/db';
import { comparePassword } from '@/lib/hash';
import { users } from '@/lib/schema';
import { createSession, deleteSession } from '@/lib/session';
import { loginSchema } from '@/lib/validations';
import { eq } from 'drizzle-orm';

export async function loginAction(prev: any, data: FormData) {
  const formData = Object.fromEntries(data.entries());

  const validate = loginSchema.safeParse(formData);

  if (!validate.success) {
    return {
      errors: validate.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validate.data;
  console.log('🚀 ~ loginAction ~ email, password:', email, password);

  let userId = null;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { message: 'Email atau password salah' };
    }

    if (!user.status) {
      return { message: 'Akun anda tidak aktif' };
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return { message: 'Email atau password salah' };
    }

    userId = user.id.toString();
  } catch (err: any) {
    return {
      message: err.message,
    };
  }

  if (!userId) {
    return { message: 'Email atau password salah' };
  }

  await createSession(userId);
}

export async function logoutAction() {
  await deleteSession();
}
