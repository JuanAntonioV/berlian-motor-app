'use client';

import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';

export default function Provider({ children }: PropsWithChildren) {
  return (
    <div>
      <SessionProvider>{children}</SessionProvider>
      <NextTopLoader />
      <Toaster position='bottom-right' reverseOrder={false} />
    </div>
  );
}
