'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import Form from './Form';
import SubmitButton from './SubmitButton';
import { loginAction } from '@/actions/authAction';
import FieldError from './FieldError';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function LoginForm() {
  const [state, action] = useFormState(loginAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success('Berhasil masuk');
      router.push('/dashboard');
    }

    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Form action={action} id='loginForm'>
      <div className='form-group'>
        <Label htmlFor='email'>Alamat email</Label>
        <Input
          id='email'
          name='email'
          placeholder='Alamat email'
          type='email'
          autoFocus
          required
          error={!!state?.errors?.email}
        />

        <FieldError errors={state?.errors?.email} name='Alamat email' />
      </div>
      <div className='form-group'>
        <Label htmlFor='password'>Kata sandi</Label>
        <Input
          id='password'
          name='password'
          placeholder='Kata sandi'
          type='password'
          required
          error={!!state?.errors?.password}
        />

        <FieldError errors={state?.errors?.password} name='Kata sandi' />
      </div>

      <div className='mt-4'>
        <SubmitButton className='w-full' form='loginForm'>
          Masuk
        </SubmitButton>
      </div>
    </Form>
  );
}
