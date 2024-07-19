import Link from 'next/link';

export default function BrandLogo() {
  return (
    <div className='flexCenter'>
      <Link href='/' className='font-bold text-3xl lg:text-2xl text-white'>
        Berlian Motor
      </Link>
    </div>
  );
}
