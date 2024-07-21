'use client';

import Center from '@/components/Center';
import Link from 'next/link';
import ErrorImage from '@/assets/images/500.png';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { IoReload } from 'react-icons/io5';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Center className={'relative'}>
      <div className={'w-full max-w-screen-xl p-6'}>
        <header className='flexCenter'>
          <div className='w-[400px] relative'>
            <Image
              src={ErrorImage}
              alt='Not Found Image'
              priority
              className='object-contain w-full'
            />
          </div>
        </header>

        <main className='space-y-3 text-center mt-8'>
          <h1 className='text-3xl font-bold'>Terjadi kesalahan pada server</h1>
          <p className='text-gray-600'>
            Silakan coba beberapa saat lagi atau hubungi tim support kami.
          </p>
        </main>

        <footer className='flexCenter gap-4 mt-6'>
          <Button className='mt-4' variant={'outline'} onClick={reset}>
            <IoReload className='mr-2' size={20} />
            Coba Lagi
          </Button>
          <Button asChild className='mt-4'>
            <Link href='/' replace>
              Kembali ke Beranda
            </Link>
          </Button>
        </footer>
      </div>

      <footer className='absolute bottom-0 lg:bottom-4 left-1/2 -translate-x-1/2 flexCenter w-full md:max-w-screen-lg px-6'>
        <p className='text-gray-400 text-sm line-clamp-3'>{error.stack}</p>
      </footer>
    </Center>
  );
}
