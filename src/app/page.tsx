import Center from '@/components/Center';
import { DateTime } from 'luxon';

export default function HomePage() {
  const now = DateTime.now().toLocaleString(DateTime.DATETIME_FULL);

  return (
    <Center>
      <div>
        <h1 className='text-4xl font-bold text-center'>
          Welcome to NextJS + Tailwind CSS
        </h1>
        <p className='text-center mt-4'>
          This is a home page of a Next.js app with Tailwind CSS.
        </p>
      </div>
      <footer className='absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-500'>
        <p>Today: {now}</p>
      </footer>
    </Center>
  );
}
