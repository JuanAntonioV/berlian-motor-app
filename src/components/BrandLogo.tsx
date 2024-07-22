import Link from 'next/link';

export default function BrandLogo() {
  return (
    <div className='flex items-center'>
      <Link href='/' className='font-bold text-2xl lg:text-2xl'>
        Berlian Motor
      </Link>
    </div>
  );
}
