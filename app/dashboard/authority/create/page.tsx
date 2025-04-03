// import Form from '@/app/ui/authoritys/create-form';
import Form from '@/app/ui/authority/form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Create Authority',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Authority', href: '/dashboard/authority' },
          {
            label: 'Create Authority',
            href: '/dashboard/authority/create',
            active: true,
          },
        ]}
      />
      <Form mode="create" authority={null} />
    </main>
  );
}
