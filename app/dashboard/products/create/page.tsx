// import Form from '@/app/ui/products/create-form';
import Form from '@/app/ui/products/form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: 'Create Products',
};

export default async function Page() {
    return (
        <main>
            <Breadcrumbs
            breadcrumbs={[
                { label: 'Products', href: '/dashboard/products' },
                {
                label: 'Create Product',
                href: '/dashboard/products/create',
                active: true,
                },
            ]}
            />
            <Form mode="create" product={null} />
        </main>
    );
}