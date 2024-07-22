'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';
import { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/hooks/useUsers';

import { TMenu } from '@/types';
import { TbLayoutDashboard } from 'react-icons/tb';
import { menuLists } from './Sidebar';

export default function MenuSearch() {
  const { user, loading } = useUsers();
  const permissions = user?.permissions;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // menu lists is array of TMenu
  const dashboard = {
    label: 'Dashboard',
    href: '/dashboard',
    badge: 'New',
    icon: <TbLayoutDashboard size={22} />,
  };

  // add dashboard menu to the list
  const appMenus: TMenu[] = [dashboard, ...menuLists];

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

    return;
  }

  return (
    <div className='hidden lg:block w-full relative'>
      <Command className='border'>
        <CommandInput
          className='w-full'
          disabled={loading}
          placeholder='Cari menu...'
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        />
        <CommandList
          hidden={!open}
          className='absolute top-full !bg-white w-full rounded-lg shadow-lg mt-2 z-10'
        >
          <CommandEmpty>Menu tidak ditemukan</CommandEmpty>
          {appMenus
            .filter(
              (menu) =>
                menu.label === 'Dashboard' ||
                permissions?.some((permission) => {
                  return (
                    menu.label
                      .toLowerCase()
                      .includes(permission.toLowerCase()) ||
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
                          onSelect={() =>
                            handleSelect('submenu', subMenu.label)
                          }
                          className='flex items-center gap-1 text-gray-600 p-2'
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
      </Command>
    </div>
  );
}
