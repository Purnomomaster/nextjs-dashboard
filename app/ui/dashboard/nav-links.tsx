'use client';

import * as Icons from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from '@/app/lib/definitions';

interface MenuProps {
  menus: Menu[];
}

export function generateNavLinks({menus}: MenuProps) {
  return menus.map((menu) => {
    const IconComponent = Icons[menu.icon.trim() as keyof typeof Icons] || Icons['HomeIcon']; // Gunakan default jika tidak ditemukan

    return {
      name: menu.name.trim(),
      href: `/${menu.dir.trim()}/${menu.end.trim()}`.replace(/\/+$/, ''), // Hilangkan double slash
      icon: <IconComponent className="w-5 h-5" />, // Render ikon secara dinamis
    };
  });
}

// Contoh penggunaan



// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
// const links = [
//   { name: 'Home', href: '/dashboard', icon: HomeIcon },
//   {
//     name: 'Invoices',
//     href: '/dashboard/invoices',
//     icon: DocumentDuplicateIcon,
//   },
//   { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
//   { name: 'Product', href: '/dashboard/product', icon: ArchiveBoxIcon },
//   { name: 'Menus', href: '/dashboard/menu', icon: InboxIcon },
// ];

export default function NavLinks({menus}: MenuProps) {
  const links = generateNavLinks({ menus });
  // console.log(links);
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            {LinkIcon}
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
