'use client';

import Center from '@/components/Center';
import Link from 'next/link';
import NotFoundImage from '@/assets/images/404.png';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { IoReload } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  const onReload = () => {
    router.refresh();
  };

  return (
    <Center className={'relative'}>
      <div className={'w-full max-w-screen-xl p-6'}>
        <header className='flexCenter'>
          <div className='w-[500px] relative'>
            <Image
              src={NotFoundImage}
              alt='Not Found Image'
              className='object-contain w-full'
            />
          </div>
        </header>

        <main className='space-y-3 text-center mt-8'>
          <h1 className='text-3xl font-bold'>
            Maaf, halaman yang Anda cari tidak ditemukan
          </h1>
          <p className='text-gray-600'>
            Silakan coba beberapa saat lagi atau hubungi tim support kami.
          </p>
        </main>

        <footer className='flexCenter gap-4 mt-6'>
          <Button className='mt-4' variant={'outline'} onClick={onReload}>
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
    </Center>
  );
}
