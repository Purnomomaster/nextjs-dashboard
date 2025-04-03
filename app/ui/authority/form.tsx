'use client';
import { Authority } from '@/app/lib/definitions';
import { createAuthority, updateAuthority } from '@/app/model/authority/action';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
// import { generateState } from '@/app/lib/statebuilder';
import inputauthority from './inputauthority';
// const initialState = generateState(inputauthority);

interface FormProps {
  mode: 'create' | 'edit';
  authority?: Authority | null;
}

export default function Form({ mode, authority }: FormProps) {
  const action =
    mode === 'create'
      ? createAuthority
      : authority?.id
        ? updateAuthority.bind(null, authority.id)
        : () => Promise.reject('Authority ID is required for update');
  const initialState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(action, initialState);

  return (
    <form action={dispatch} aria-describedby="form-error">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Authority ID (only for edit mode) */}
        {mode === 'edit' && (
          <div className="mb-4">
            <label htmlFor="id" className="mb-2 block text-sm font-medium">
              Authority ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="id"
                name="id"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={authority?.id ?? ''}
                aria-describedby="authority-id-error"
                readOnly
              />
            </div>
            <div id="authority-id-error" aria-live="polite" aria-atomic="true">
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
        {inputauthority.map((input) => (
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
              defaultValue={authority ? authority[input.kolom] : ''}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby={`${input.kolom}-error`}
            />
            <div
              id={`${input.kolom}-error`}
              aria-live="polite"
              aria-atomic="true"
            >
              {state.errors?.[input.kolom as keyof typeof state.errors] &&
                state.errors[input.kolom as keyof typeof state.errors]?.map(
                  (error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ),
                )}
            </div>
          </div>
        ))}

        {/* Image Upload */}
        <div className="mb-4">
          <label htmlFor="image" className="mb-2 block text-sm font-medium">
            Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="image-error"
          />
          <div id="image-error" aria-live="polite" aria-atomic="true">
            {state.errors?.image &&
              state.errors.image.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

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
            {state.errors?.file &&
              state.errors.file.map((error: string) => (
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
          href="/dashboard/authority"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">
          {mode === 'create' ? 'Create Authority' : 'Edit Authority'}
        </Button>
      </div>
    </form>
  );
}
