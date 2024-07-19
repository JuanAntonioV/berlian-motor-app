'use client';

import { IoSearch } from 'react-icons/io5';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = {
  wrapperClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Search({ wrapperClassName, ...props }: Props) {
  const [search, setSearch] = useState('');

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (search.trim() === '') {
      return;
    }

    router.replace(
      `${pathname}?${createQueryString({
        search: search,
      })}`
    );
  }

  function onClear() {
    setSearch('');
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('search');
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  }

  return (
    <form
      onSubmit={onSearch}
      className={cn(
        'flex w-full max-w-xs items-center space-x-2',
        wrapperClassName
      )}
    >
      <Input
        type='text'
        placeholder='Cari sesuatu...'
        {...props}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button type='submit' variant={'outline'}>
        <IoSearch size={20} className='text-neutral-500' />
      </Button>

      {searchParams.get('search') && (
        <Button
          type='button'
          variant={'outline'}
          className='text-destructive hover:text-destructive/90'
          onClick={onClear}
        >
          Reset
        </Button>
      )}
    </form>
  );
}
