// import Form from '@/app/ui/products/edit-form';
import Form from '@/app/ui/product/form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchProduct } from '@/app/model/product';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Edit Product',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const product = await fetchProduct(id);
  console.log(product, id, params);
  if (!product) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/product' },
          {
            label: 'Edit Product',
            href: `/dashboard/product/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form mode="edit" product={product} />
    </main>
  );
}
