import { fetchProducts } from "@/app/lib/data";
import Table from "@/app/ui/products/table";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

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
            <Suspense fallback={<InvoicesTableSkeleton />}>
                <Table products={products} />
            </Suspense>
        </div>
    );
}