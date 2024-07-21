'use server';

import { loginSchema } from '@/lib/validations';
import { redirect } from 'next/navigation';

export async function loginAction(prev: any, data: FormData) {
  const formData = Object.fromEntries(data.entries());

  const validate = loginSchema.safeParse(formData);

  if (!validate.success) {
    return {
      errors: validate.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validate.data;

  console.log(email, password);

  redirect('/dashboard');
}
