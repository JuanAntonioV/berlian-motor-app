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

          <main className='h-[calc(100vh-114px)] overflow-auto w-full py-7 px-4 md:px-10 bg-gray-100'>
            {children}
          </main>
        </main>
      </div>
    </div>
  );
}
