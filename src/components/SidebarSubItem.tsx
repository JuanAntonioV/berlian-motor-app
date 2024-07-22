import { cn } from '@/lib/utils';
import { TSubMenus } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  item: TSubMenus;
};
export default function SidebarSubItem({ item }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={item.href}
      className='w-full py-2 px-4 flexBetween gap-2 group border-l border-gray-300 ml-6 pl-6'
    >
      <div
        className={cn(
          'flex items-center group-hover:translate-x-1 duration-200 text-gray-900',
          pathname === item.href && 'text-blue-700'
        )}
      >
        <span className='text-sm'>{item.label}</span>
      </div>
    </Link>
  );
}
