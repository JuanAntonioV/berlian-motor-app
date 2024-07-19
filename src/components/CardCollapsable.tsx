'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  title: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  className?: string;
};

export default function CardCollapsable({
  children,
  title,
  open = true,
  setOpen,
  className,
}: Props) {
  const [showChildren, setShowChildren] = useState(open);

  useEffect(() => {
    setShowChildren(open);
  }, [open]);

  function onToggle() {
    setShowChildren((prev) => !prev);
    if (setOpen) {
      setOpen(!showChildren);
    }
  }

  return (
    <div className={cn('border p-4 rounded-lg h-fit', className)}>
      <header className='flexBetween'>
        <h2 className='text-lg font-semibold'>{title}</h2>
        <Button variant={'ghost'} size={'icon'} onClick={onToggle}>
          {showChildren ? (
            <IoIosArrowUp size={20} />
          ) : (
            <IoIosArrowDown size={20} />
          )}
        </Button>
      </header>

      {showChildren && <div className='mt-2 border-t pt-4'>{children}</div>}
    </div>
  );
}
