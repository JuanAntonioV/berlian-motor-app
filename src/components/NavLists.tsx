import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { TbLayoutDashboard } from 'react-icons/tb';
import SidebarItem from './SidebarItem';
import { usePathname } from 'next/navigation';
import { menuLists } from './Sidebar';

type Props = {
  closeSidebar?: () => void;
};

export default function NavLists({ closeSidebar }: Props) {
  const pathname = usePathname();

  return (
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
            <SidebarItem item={item} closeSidebar={closeSidebar} />
          </li>
        ))}
      </ul>
    </main>
  );
}
