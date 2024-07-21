'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import Form from './Form';
import SubmitButton from './SubmitButton';
import { loginAction } from '@/actions/authAction';

export default function LoginForm() {
  const [state, action] = useFormState(loginAction, null);

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
        />

        {state?.errors?.email && (
          <div className='text-red-500 text-sm'>{state.errors?.email}</div>
        )}
      </div>
      <div className='form-group'>
        <Label htmlFor='password'>Kata sandi</Label>
        <Input
          id='password'
          name='password'
          placeholder='Kata sandi'
          type='password'
          required
        />

        {state?.errors?.password && (
          <div className='text-red-500 text-sm'>{state.errors?.password}</div>
        )}
      </div>

      <div className='mt-4'>
        <SubmitButton className='w-full' form='loginForm'>
          Masuk
        </SubmitButton>
      </div>
    </Form>
  );
}
