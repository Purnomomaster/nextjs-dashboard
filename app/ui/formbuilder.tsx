import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { State } from '@/app/lib/statebuilder';

export interface Input {
  kolom: string;
  label: string;
  jns: string;
  maxlength?: number;
  readonly?: boolean;
  required?: string;
}

export interface FormProps<T> {
  dispatch: (event: any) => void;
  item: T;
  input: Input[];
  state: State;
  mode: 'create' | 'edit';
}

export function generateForm<T extends { id?: string; [key: string]: any }>({
  dispatch,
  item,
  input,
  state,
  mode,
}: FormProps<T>) {
  return (
    <form action={dispatch} aria-describedby="form-error">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Product ID (only for edit mode) */}
        {mode === 'edit' && (
          <div className="mb-4">
            <label htmlFor="id" className="mb-2 block text-sm font-medium">
              Product ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="id"
                name="id"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={item?.id ?? ''}
                aria-describedby="item-id-error"
                readOnly
              />
            </div>
            <div id="item-id-error" aria-live="polite" aria-atomic="true">
              {(state.errors?.id || []).map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Generate Inputs from Input Builder */}
        {input.map((input) => (
          <div className="mb-4" key={input.kolom}>
            <label
              htmlFor={input.kolom}
              className="mb-2 block text-sm font-medium"
            >
              {input.label}
            </label>
            <input
              id={input.kolom}
              name={input.kolom}
              type={input.jns}
              maxLength={input.maxlength}
              readOnly={input.readonly}
              required={input.required === 'Y'}
              defaultValue={item ? item[input.kolom] : ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby={`${input.kolom}-error`}
            />
            <div
              id={`${input.kolom}-error`}
              aria-live="polite"
              aria-atomic="true"
            >
              {(state.errors?.[input.kolom] || []).map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* File Upload */}
        <div className="mb-4">
          <label htmlFor="file" className="mb-2 block text-sm font-medium">
            File
          </label>
          <input
            id="file"
            name="file"
            type="file"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="file-error"
          />
          <div id="file-error" aria-live="polite" aria-atomic="true">
            {(state.errors?.file || []).map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div id="form-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/item"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">
          {mode === 'create' ? 'Create Product' : 'Edit Product'}
        </Button>
      </div>
    </form>
  );
}

export default generateForm;
