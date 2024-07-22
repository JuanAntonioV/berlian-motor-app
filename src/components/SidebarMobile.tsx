'use client';

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';
import { HiMenuAlt2 } from 'react-icons/hi';
import BrandLogo from './BrandLogo';
import NavLists from './NavLists';

export default function SidebarMobile() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1024) {
        setOpen(false);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='block lg:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant='outline' size={'icon'}>
            <HiMenuAlt2 size={24} className='text-neutral-800' />
          </Button>
        </SheetTrigger>
        <SheetContent
          side={'left'}
          className='overflow-y-auto px-0 bg-white border-none max-w-80'
        >
          <SheetHeader className='px-6'>
            <SheetTitle>
              <BrandLogo />
            </SheetTitle>
          </SheetHeader>

          <NavLists closeSidebar={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
