import { fetchMenus } from '@/app/model/menu/action';
import Search from '@/app/ui/search';
import { Suspense } from 'react';
import { lusitana } from '@/app/ui/fonts';
// import CreateMenu from '@/app/ui/menu/buttons';
import {CreateMenuDialog} from '@/app/ui/menu/createdialog';
import MenuTableSkeleton from '@/app/ui/menu/skeleton';
import MenuTable from '@/app/ui/menu/table';


export default async function Page() {
  const menus = await fetchMenus(); // Fetch menu list from the database
  console.log(menus);
   // Calculate the highest lv1 value from all menus
   const highestLv1 = menus.reduce((highest, menu) => {
    const lv1Value = menu.lv1 || 0
    return lv1Value > highest ? lv1Value : highest
  }, 0)

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Daftar Menu
      </h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search menus..." />
        {/* <CreateMenu /> */}
        <CreateMenuDialog menus={menus}  highestLv1={highestLv1} btnname='Lv1'/>
      </div>
      <Suspense fallback={<MenuTableSkeleton />}>
        <MenuTable menus={menus} />
      </Suspense>
    </div>
  );
}
