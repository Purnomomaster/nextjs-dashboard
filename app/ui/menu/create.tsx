'use client';

import { useFormState } from 'react-dom';
import { createMenu } from '@/app/lib/actions';
import { Menu } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

interface FormProps {
    menus: Menu[];
}

export default function Form({ menus }: FormProps) {
    const initialState = { message: '', errors: {} };
    const [state, dispatch] = useFormState(createMenu, initialState);

    return (
        <form action={dispatch} aria-describedby="form-error" encType="multipart/form-data">
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Menu Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Menu Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        aria-describedby="name-error"
                    />
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Menu Description */}
                <div className="mb-4">
                    <label htmlFor="description" className="mb-2 block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        aria-describedby="description-error"
                    />
                    <div id="description-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.description &&
                            state.errors.description.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Copy Menu ID */}
                <div className="mb-4">
                    <label htmlFor="copyMenuId" className="mb-2 block text-sm font-medium">
                        Copy Menu ID (Optional)
                    </label>
                    <select
                        id="copyMenuId"
                        name="copyMenuId"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        aria-describedby="copyMenuId-error"
                    >
                        <option value="">Select a menu to copy</option>
                        {menus.map((menu) => (
                            <option key={menu.id} value={menu.id}>
                                {menu.title}
                            </option>
                        ))}
                    </select>
                    <div id="copyMenuId-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.copyMenuId &&
                            state.errors.copyMenuId.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

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
                    href="/dashboard/menu"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Create Menu</Button>
            </div>
        </form>
    );
}