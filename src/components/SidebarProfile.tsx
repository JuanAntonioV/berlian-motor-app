'use client';

import { useUsers } from '@/hooks/useUsers';
import { Button } from './ui/button';
import { LuLogOut } from 'react-icons/lu';
import { logoutAction } from '@/actions/authAction';
import { HiOutlineUserCircle } from 'react-icons/hi';
import Image from 'next/image';

export default function SidebarProfile() {
  const { user, loading } = useUsers();

  if (loading) return null;

  return (
    <div className='flexBetween px-4 py-3 border-t'>
      <div className='flex items-center gap-2'>
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name}
            className='w-8 h-8 rounded-full'
            fill
          />
        ) : (
          <div className='w-8 h-8 rounded-full bg-gray-100 flexCenter border'>
            <HiOutlineUserCircle size={20} className='text-gray-400' />
          </div>
        )}
        <div>
          <h2 className='text-sm font-semibold line-clamp-1'>{user?.name}</h2>
          <p className='text-xs text-gray-400  line-clamp-1'>{user?.email}</p>
        </div>
      </div>
      <form action={logoutAction}>
        <Button variant='outline' size='sm' type='submit'>
          <LuLogOut size={18} className='text-destructive' />
        </Button>
      </form>
    </div>
  );
}
