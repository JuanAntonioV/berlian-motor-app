'use client';

import { useFormStatus } from 'react-dom';
import { Button, ButtonProps } from './ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
} & ButtonProps;

export default function SubmitButton({
  children,
  isLoading,
  className,
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      className={cn(className)}
      disabled={pending || isLoading}
      {...props}
    >
      {pending || isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Mohon tunggu...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
