import Form from '@/app/ui/menu/create';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchMenus } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Menu',
};

export default async function Page() {
    const menus = await fetchMenus();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Menu', href: '/dashboard/menu' },
                    {
                        label: 'Create Menu',
                        href: '/dashboard/menu/create',
                        active: true,
                    },
                ]}
            />
            <Form menus={menus} />
        </main>
    );
}