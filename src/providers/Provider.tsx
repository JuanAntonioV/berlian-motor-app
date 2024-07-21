'use client';

import NextTopLoader from 'nextjs-toploader';
import { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';

export default function Provider({ children }: PropsWithChildren) {
  return (
    <div>
      {children}
      <NextTopLoader />
      <Toaster position='bottom-right' reverseOrder={false} />
    </div>
  );
}
