import Form from '@/app/ui/products/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById, fetchProduct } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Edit Product',
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const products = await fetchProduct(id);
    console.log(products, id, params)
    if (!products) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Products', href: '/dashboard/products' },
                    {
                        label: 'Edit Product',
                        href: `/dashboard/products/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form products={products} />
        </main>
    );
}