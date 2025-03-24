import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { fetchProducts } from '@/app/model/product/action';
import { CreateProduct } from '@/app/ui/product/buttons';
import Table from '@/app/ui/product/table';
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const resolvedSearchParams = await searchParams; // Await sebelum digunakan
  const query = resolvedSearchParams?.query || '';
  const product = await fetchProducts(query);
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Product
      </h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search product..." />
        <CreateProduct />
      </div>
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <Table product={product} />
      </Suspense>
    </div>
  );
}
