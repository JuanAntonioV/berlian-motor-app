'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/hooks/useUsers';
import { TbLayoutDashboard } from 'react-icons/tb';
import { TMenu } from '@/types';
import { menuLists } from './Sidebar';

export default function SearchMenuDialog() {
  const { user, loading } = useUsers();
  const permissions = user?.permissions;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // add dashboard menu to the list
  const appMenus: TMenu[] = useMemo(
    () =>
      [
        {
          label: 'Dashboard',
          href: '/dashboard',
          badge: 'New',
          icon: <TbLayoutDashboard size={22} />,
        },
        ...menuLists,
      ] as TMenu[],
    []
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  function handleSelect(type: string, label: string) {
    const selected = appMenus.find((menu) => {
      if (type === 'menu') {
        return menu.label === label;
      } else {
        return menu.subMenus?.find((subMenu) => subMenu.label === label);
      }
    });

    if (selected) {
      setOpen(false);
      router.push(selected.href);
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Cari menu...' disabled={loading} />
      <CommandList>
        <CommandEmpty>Menu tidak ditemukan</CommandEmpty>
        {appMenus
          .filter(
            (menu) =>
              menu.label === 'Dashboard' ||
              permissions?.some((permission) => {
                return (
                  menu.label.toLowerCase().includes(permission.toLowerCase()) ||
                  menu.subMenus?.some((subMenu) =>
                    subMenu.label
                      .toLowerCase()
                      .includes(permission.toLowerCase())
                  )
                );
              })
          )
          .map((menu) => (
            <Fragment key={`command-search-${menu.label}`}>
              {menu.subMenus && menu.subMenus.length > 0 ? (
                <CommandGroup heading={menu.label}>
                  {menu.subMenus.map((subMenu) => (
                    <Fragment key={`subCommand-search-${subMenu.label}`}>
                      <CommandItem
                        value={subMenu.label}
                        onSelect={() => handleSelect('submenu', subMenu.label)}
                        className='flex items-center gap-1 text-neutral-600 p-4'
                      >
                        {subMenu.label}
                      </CommandItem>
                    </Fragment>
                  ))}
                </CommandGroup>
              ) : (
                <CommandItem
                  className='flex items-center gap-1 text-neutral-600 p-4'
                  value={menu.label}
                  onSelect={() => handleSelect('menu', menu.label)}
                >
                  {menu.label}
                </CommandItem>
              )}
              <CommandSeparator />
            </Fragment>
          ))}
      </CommandList>
    </CommandDialog>
  );
}
