'use client';

import SidebarProfile from './SidebarProfile';
import NavLists from './NavLists';
import { TMenu } from '@/types';
import { AiOutlineProduct } from 'react-icons/ai';
import { RiFolderSettingsLine } from 'react-icons/ri';
import { MdOutlineInventory2 } from 'react-icons/md';
import { LuUsers2 } from 'react-icons/lu';
import BrandLogo from './BrandLogo';

export const menuLists: TMenu[] = [
  {
    label: 'Kelola Produk',
    href: '/kelola-produk',
    icon: <AiOutlineProduct size={24} />,
  },
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
    label: 'Manajemen',
    href: '/manajemen',
    icon: <RiFolderSettingsLine size={22} />,
    subMenus: [
      {
        label: 'Kelola Rak',
        href: '/kelola-rak',
      },
      {
        label: 'Kelola Merek',
        href: '/kelola-merek',
      },
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
  return (
    <aside className='h-screen max-w-64 w-full overflow-auto scrollbar relative hidden lg:block '>
      <nav className='h-full flex flex-col bg-white border-r shadow-sm'>
        <header className='px-4 py-3 pb-2 flexBetween'>
          <BrandLogo />
        </header>

        <NavLists />
      </nav>
      <footer className='absolute bottom-0 w-full'>
        <SidebarProfile />
      </footer>
    </aside>
  );
}
