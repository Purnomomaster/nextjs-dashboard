// import Form from '@/app/ui/authoritys/edit-form';
import Form from '@/app/ui/authority/form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchAuthority } from '@/app/model/authority/action';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Edit Authority',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const authority = await fetchAuthority(id);
  console.log(authority, id, params);
  if (!authority) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Authoritys', href: '/dashboard/authority' },
          {
            label: 'Edit Authority',
            href: `/dashboard/authority/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form mode="edit" authority={authority} />
    </main>
  );
}
