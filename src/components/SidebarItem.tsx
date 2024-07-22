'use client';

import { cn } from '@/lib/utils';
import { TMenu } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LuUsers2 } from 'react-icons/lu';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import SidebarSubItem from './SidebarSubItem';
import { Badge } from './ui/badge';

type Props = {
  item: TMenu;
};

export default function SidebarItem({ item }: Props) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  return (
    <div>
      {item.subMenus ? (
        <button
          className={cn(
            'w-full rounded-lg py-2 px-4 flexBetween gap-2 group',
            item.subMenus.some((subItem) => subItem.href === pathname) &&
              'bg-blue-100'
          )}
          onClick={() => setOpen(!open)}
        >
          <div
            className={cn(
              'flex items-center gap-3 group-hover:translate-x-1 duration-200 text-gray-900',
              pathname === item.href && 'text-blue-700',
              item.subMenus.some((subItem) => subItem.href === pathname) &&
                'text-blue-700'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge && <Badge>{item.badge}</Badge>}
          </div>

          {open && item.subMenus ? (
            <MdKeyboardArrowUp size={20} className='text-gray-400' />
          ) : (
            <MdKeyboardArrowDown size={20} className='text-gray-400' />
          )}
        </button>
      ) : (
        <Link
          href={item.href}
          className='w-full rounded-lg py-2 px-4 flexBetween gap-2 group'
        >
          <div className='flex items-center gap-3 group-hover:translate-x-1 duration-200 text-gray-900'>
            {item.icon}
            <span>{item.label}</span>
          </div>
        </Link>
      )}

      {open && item.subMenus && (
        <ul className='my-2'>
          {item.subMenus.map((subItem) => (
            <li key={subItem.label}>
              <SidebarSubItem item={subItem} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
