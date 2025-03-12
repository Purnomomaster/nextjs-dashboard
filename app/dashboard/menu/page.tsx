import { fetchMenus } from '@/app/lib/data';
import Link from 'next/link';
import Search from '@/app/ui/search';
import { Menu } from '@/app/lib/definitions';
import { Suspense } from 'react';
import { lusitana } from '@/app/ui/fonts';
import CreateMenu from '@/app/ui/invoices/buttons';
import MenuTableSkeleton from '@/app/ui/menu/skeleton';
import MenuTable from '@/app/ui/menu/table';

// const lusitana = Lusitana({ subsets: ['latin'] });

export default async function Page() {
  const menus = await fetchMenus(); // Fetch menu list from the database

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Daftar Menu
      </h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search menus..." />
        <CreateMenu />
      </div>
      <Suspense fallback={<MenuTableSkeleton />}>
        <MenuTable menus={menus} />
      </Suspense>
    </div>
  );
}
