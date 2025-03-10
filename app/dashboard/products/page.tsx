import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
// dinamis
const page = "products";
import { fetchProducts } from "@/app/lib/data";
import { CreateProduct } from '@/app/ui/products/buttons';
import Table from "@/app/ui/products/table";
export default async function Page({
    searchParams,
}: {
    searchParams?: {
        query?: string;
    };
}) {
    const query = searchParams?.query || "";
    const products = await fetchProducts(query)
    return (
        <div className="w-full">
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
                Products
            </h1>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search products..." />
                <CreateProduct />
            </div>
            <Suspense fallback={<InvoicesTableSkeleton />}>
                <Table products={products} />
            </Suspense>
        </div>
    );
}