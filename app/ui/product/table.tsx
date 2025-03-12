import { Product } from '@/app/lib/definitions';
import { DeleteProduct, UpdateProduct } from './buttons';
import { formatCurrency } from '@/app/lib/utils';

export default async function CustomersTable({
  product,
}: {
  product: Product[];
}) {
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {product?.map((product) => (
                  <div
                    key={product.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="text-sm text-gray-500">{product.id}</p>
                        <p className="text-sm text-gray-500">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.price}</p>
                        <div className="flex justify-end gap-2">
                          <UpdateProduct id={product.id} />
                          <DeleteProduct id={product.id} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="w-1/4 px-4 py-5 font-medium">
                      Id
                    </th>
                    <th scope="col" className="w-1/4 px-3 py-5 font-medium">
                      Name
                    </th>
                    <th scope="col" className="w-1/4 px-3 py-5 font-medium">
                      Price
                    </th>
                    <th
                      scope="col"
                      className="w-1/4 px-3 py-5 text-end font-medium"
                    >
                      Edit
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {product.map((product) => (
                    <tr key={product.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 text-sm">
                        <p>{product.id}</p>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateProduct id={product.id} />
                          <DeleteProduct id={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
