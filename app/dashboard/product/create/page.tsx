// import Form from '@/app/ui/products/create-form';
import Form from '@/app/ui/product/form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Create Product',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Product', href: '/dashboard/product' },
          {
            label: 'Create Product',
            href: '/dashboard/product/create',
            active: true,
          },
        ]}
      />
      <Form mode="create" product={null} />
    </main>
  );
}
