import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { fetchMenus } from '@/app/model/menu/action';
import Table from '@/app/ui/authority/table';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const resolvedSearchParams = await searchParams; // Await sebelum digunakan
  const query = resolvedSearchParams?.query || '';
  const menus = await fetchMenus(query);
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Authority
      </h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search authority..." />
      </div>
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <Table menus={menus} />
      </Suspense>
    </div>
  );
}
