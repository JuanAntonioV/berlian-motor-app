'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { MdHome } from 'react-icons/md';
import { Fragment } from 'react';

export default function MainBreadcrumb() {
  const paths = usePathname();
  const pathNames = paths
    .split('/')
    .map((path) => path.replace(/[-_]/g, ' '))
    .filter((path) => path);

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/' className='flex items-center gap-x-1'>
              <MdHome size={16} />
              Beranda
            </BreadcrumbLink>
          </BreadcrumbItem>

          {pathNames.map((path, index) => (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === pathNames.length - 1 ? (
                  <BreadcrumbPage className='capitalize'>{path}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={`/${path.toLowerCase().replace(/ /g, '-')}`}
                    className='capitalize'
                  >
                    {path}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
