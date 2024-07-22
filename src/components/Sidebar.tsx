'use client';

import { TbLayoutDashboard } from 'react-icons/tb';
import { LuUsers2 } from 'react-icons/lu';
import SidebarItem from './SidebarItem';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { TMenu } from '@/types';
import { AiOutlineProduct } from 'react-icons/ai';
import { RiFolderSettingsLine } from 'react-icons/ri';
import { MdOutlineInventory2 } from 'react-icons/md';
import { Badge } from './ui/badge';
import SidebarProfile from './SidebarProfile';

export const menuLists: TMenu[] = [
  {
    label: 'Karyawan',
    href: '/kelola-karyawan',
    icon: <LuUsers2 size={22} />,
    subMenus: [
      {
        label: 'Kelola Karyawan',
        href: '/kelola-karyawan',
      },
      {
        label: 'Kelola Peran',
        href: '/kelola-peran',
      },
      {
        label: 'Kelola Hak Akses',
        href: '/kelola-hak-akses',
      },
    ],
  },
  {
    label: 'Produk',
    href: '/kelola-produk',
    icon: <AiOutlineProduct size={24} />,
  },
  {
    label: 'Manajemen',
    href: '/manajemen',
    icon: <RiFolderSettingsLine size={22} />,
    subMenus: [
      {
        label: 'Kelola Tipe',
        href: '/kelola-tipe',
      },
      {
        label: 'Kelola Kategori',
        href: '/kelola-kategori',
      },
    ],
  },
  {
    label: 'Persediaan',
    href: '/kelola-persediaan',
    icon: <MdOutlineInventory2 size={22} />,
    subMenus: [
      {
        label: 'Kelola Penerimaan',
        href: '/kelola-penerimaan',
      },
      {
        label: 'Kelola Pengeluaran',
        href: '/kelola-pengeluaran',
      },
      {
        label: 'Kelola Penyesuaian',
        href: '/Kelola-penyesuaian',
      },
      {
        label: 'Transfer Barang',
        href: '/transfer-barang',
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className='h-screen max-w-64 w-full overflow-auto scrollbar relative'>
      <nav className='h-full flex flex-col bg-white border-r shadow-sm'>
        <header className='px-4 py-3 pb-2 flexBetween'>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
        </header>

        <main className='mt-8 px-4'>
          <Link
            href='/dashboard'
            className={cn(
              'w-full rounded-lg py-2 px-4 flexBetween gap-2 group',
              pathname === '/dashboard' && 'bg-blue-100'
            )}
          >
            <div
              className={cn(
                'flex items-center gap-3 group-hover:translate-x-1 duration-200',
                pathname === '/dashboard' && 'text-blue-700'
              )}
            >
              <TbLayoutDashboard size={22} />
              <span>Dashboard</span>
            </div>

            <Badge>New</Badge>
          </Link>

          <div className='mb-2 mt-8 px-4'>
            <p className='text-sm text-gray-400'>Menu</p>
          </div>

          <ul className='space-y-2'>
            {menuLists.map((item) => (
              <li key={item.label}>
                <SidebarItem item={item} />
              </li>
            ))}
          </ul>
        </main>
      </nav>
      <footer className='absolute bottom-0 w-full'>
        <SidebarProfile />
      </footer>
    </aside>
  );
}
