'use server';

import { signIn, signOut } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { AuthError } from 'next-auth';

export async function loginAction(prev: any, data: FormData) {
  const formData = Object.fromEntries(data.entries());

  const validate = loginSchema.safeParse(formData);

  if (!validate.success) {
    return {
      errors: validate.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validate.data;

  try {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    console.log('🚀 ~ loginAction ~ res:', res);

    return { success: true };
  } catch (error: any) {
    console.log('🚀 ~ loginAction ~ error:', error);
    if (error instanceof AuthError) {
      if (error.cause?.err instanceof Error) {
        return {
          message: error.cause.err.message,
        };
      }
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            message: 'Email atau password salah',
          };
        default:
          return {
            message: 'Terjadi kesalahan, silahkan coba lagi',
          };
      }
    }
    throw error;
  }
}

export async function logoutAction(formData: FormData) {
  await signOut({
    redirect: true,
    redirectTo: '/auth/login',
  });
}
