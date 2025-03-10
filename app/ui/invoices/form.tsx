'use client';
// dinamis
import { CustomerField,InvoiceForm } from '@/app/lib/definitions';
import { generateInputs } from '@/app/lib/inputbuilder';
import input from './input';
import { creating, updating, initialState } from '@/app/model/invoices';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';

interface FormProps {
  mode: 'create' | 'edit';
  invoice?: InvoiceForm;
  customers: CustomerField[];
}

export default function Form({ mode, invoice, customers }: FormProps) {
  const initialState = { message: '', errors: { id: [] as string[]} };
  const action = mode === 'create' ? creating : (invoice?.id ? updating.bind(null, invoice.id) : () => Promise.reject('Invoice ID is required for update'));
  const [state, dispatch] = useFormState(action, initialState);

  // Define dropdown options
  const dropdownOptions = {
    customer: customers.map((customer) => customer.name),
    // Add more dropdown options here if needed
  };

  return (
    <form action={dispatch} aria-describedby="form-error" encType="multipart/form-data">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Invoice ID (only for edit mode) */}
        {mode === 'edit' && (
          <div className="mb-4">
            <label htmlFor="id" className="mb-2 block text-sm font-medium">
              Invoice ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="id"
                name="id"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={invoice?.id || ''}
                aria-describedby="invoice-id-error"
                readOnly
              />
            </div>
            <div id="invoice-id-error" aria-live="polite" aria-atomic="true">
              {state.errors?.id &&
                state.errors.id.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        )}

        {/* Generate Inputs from Input Builder */}
        {generateInputs(input, state, invoice, dropdownOptions)}

        <div id="form-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">
              {state.message}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">{mode === 'create' ? 'Create Invoice' : 'Edit Invoice'}</Button>
      </div>
    </form>
  );
}