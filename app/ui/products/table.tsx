import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
    Products,
} from '@/app/lib/definitions';
import { DeleteInvoice, DeleteProduct, UpdateInvoice, UpdateProduct } from '../invoices/buttons';
import { formatCurrency } from '@/app/lib/utils';

export default async function CustomersTable({
    products,
}: {
    products: Products[];
}) {
    return (
        <div className="w-full">
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
                Products
            </h1>
            <Search placeholder="Search products..." />
            <div className="mt-6 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                            <div className="md:hidden">
                                {products?.map((product) => (
                                    <div
                                        key={product.product_id}
                                        className="mb-2 w-full rounded-md bg-white p-4"
                                    >
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <p className="text-sm text-gray-500">{product.product_id}</p>
                                                <p className="text-sm text-gray-500">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {product.price}
                                                </p>
                                                <div className="flex justify-end gap-2">
                                                    <UpdateProduct id={product.product_id} />
                                                    <DeleteProduct id={product.product_id} />
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
                                        <th scope="col" className="w-1/4 px-3 py-5 font-medium text-end">
                                            Edit
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 text-gray-900">
                                    {products.map((product) => (
                                        <tr key={product.product_id} className="group">
                                            <td className="whitespace-nowrap bg-white py-5 pl-4 text-sm">
                                                <p>{product.product_id}</p>
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                {product.name}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                {formatCurrency(product.price)}
                                            </td>
                                            <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                                                <div className="flex justify-end gap-3">
                                                    <UpdateProduct id={product.product_id} />
                                                    <DeleteProduct id={product.product_id} />
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
