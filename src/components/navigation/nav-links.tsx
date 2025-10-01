'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

import { SheetClose } from '../ui/sheet';

const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  const pathname = usePathname();
  const userId = 1;

  return (
    <>
      {sidebarLinks.map((link) => {
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

        if (link.route === '/profile') {
          if (!userId) return null;
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          `${link.route}/${userId}`;
        }
        const LinkComponent = (
          <Link
            href={link.route}
            className={cn(
              isActive ? 'primary-gradient text-light-900 rounded-lg' : 'text-dark300_light900',
              'flex items-center gap-4 bg-transparent p-4',
            )}
          >
            <Image
              src={link.imgUrl}
              alt={link.label}
              width={20}
              height={20}
              className={cn({ 'invert-colors': !isActive })}
            />
            <p
              className={cn(
                isActive ? 'base-bold' : 'base-medium',
                !isMobileNav && 'max-lg:hidden',
              )}
            >
              {link.label}
            </p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={link.route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={link.route}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
