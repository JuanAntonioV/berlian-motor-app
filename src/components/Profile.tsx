'use client';
import { LuUser2 } from 'react-icons/lu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MdLogout } from 'react-icons/md';
import SignOutButton from './SignOutButton';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUsers } from '@/hooks/useUsers';

export const profileMenus = [
  {
    label: 'Akun saya',
    href: '/akun-saya',
    icon: <LuUser2 size={18} />,
  },
  {
    label: 'Keluar',
    href: '/auth/login',
    icon: <MdLogout size={18} />,
  },
];

export default function Profile() {
  const { user, loading } = useUsers();

  if (loading) return null;

  return (
    <div className='flexEnd gap-x-4'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className='w-12 h-12'>
            {user?.image ? (
              <AvatarImage src={user.image} />
            ) : (
              <AvatarFallback>BM</AvatarFallback>
            )}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-44'>
          {profileMenus.map((menu) => (
            <DropdownMenuItem key={menu.href}>
              {menu.label === 'Keluar' ? (
                <SignOutButton />
              ) : (
                <Link
                  href={menu.href}
                  className={cn(
                    'flex items-center gap-x-3 w-full p-1 rounded-lg'
                  )}
                >
                  {menu.icon}
                  {menu.label}
                </Link>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
