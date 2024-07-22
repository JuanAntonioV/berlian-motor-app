import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { PropsWithChildren } from 'react';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className='relative'>
      <div className='flex'>
        <Sidebar />
        <main className='w-full'>
          <Header />

          <main className='h-[calc(100vh-114px)] overflow-auto w-full'>
            {children}
          </main>
        </main>
      </div>
    </div>
  );
}
