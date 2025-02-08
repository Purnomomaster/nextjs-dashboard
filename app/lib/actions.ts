"use server"

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
const client = require('../lib/db');

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.' }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await client.query({
            text: 'INSERT INTO invoices (customer_id, amount, status, date) VALUES ($1, $2, $3, $4)',
            values: [customerId, amountInCents, status, date],
        });
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }
    const { customerId, amount, status } = validatedFields.data

    const amountInCents = amount * 100;
    try {
        await client.query({
            text: 'UPDATE invoices SET customer_id = $1, amount = $2, status = $3 WHERE id = $4',
            values: [customerId, amountInCents, status, id],
        });
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Invoice.'
        }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export type PState = {
    errors?: {
        product_id?: string[];
        name?: string[];
        price?: string[];
    };
    message?: string | null;
};

const PFormSchema = z.object({
    id: z.string(),
    product_id: z.string({
        invalid_type_error: 'Please select a product id.',
    }),
    name: z.string({
        invalid_type_error: 'Please select a product.',
    }),
    price: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    date: z.string(),
});

const UpdateProduct = PFormSchema.omit({ id: true, date: true });
export async function updateProduct(id: string, prevState: PState, formData: FormData) {
    const validatedFields = UpdateProduct.safeParse({
        product_id: formData.get('product_id'),
        name: formData.get('name'),
        price: formData.get('price'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Product.',
        };
    }
    const { product_id, name, price } = validatedFields.data
    console.log(validatedFields.data)

    const amountInCents = price * 100;
    try {
        await client.query({
            text: 'UPDATE products SET product_id = $1, price = $2, name = $3 WHERE product_id = $4',
            values: [product_id, amountInCents, name, product_id],
        });
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Product.'
        }
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice');
    try {
        await client.query({
            text: 'DELETE FROM invoices WHERE id = $1',
            values: [id],
        });
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Invoice.'
        }
    }
}

export async function deleteProduct(id: string) {
    try {
        await client.query({
            text: 'DELETE FROM products WHERE product_id = $1',
            values: [id],
        });
        revalidatePath('/dashboard/products');
        return { message: 'Deleted product.' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete product.'
        }
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}