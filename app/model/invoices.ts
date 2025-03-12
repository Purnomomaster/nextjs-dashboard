import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import client from '../lib/db';
import { buildInitialState } from '@/app/lib/statebuilder';
import { generateFormSchema } from '@/app/lib/zodbuilder';
import input from '@/app/ui/invoices/input';

// Generate the initial state using the input fields from input.ts
export const initialState = buildInitialState(input);

type State = {
  errors?: {
    id?: string[];
  };
  message?: string | null;
};

const FormSchema = generateFormSchema(input);

const Create = FormSchema.omit({ id: true, date: true });
export async function creating(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = Create.safeParse({
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
      errors: {},
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

  return {
    errors: {},
    message: 'Invoice created successfully.',
  };
}

// Use Zod to update the expected types
const Update = FormSchema.omit({ id: true, date: true });

export async function updating(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = Update.safeParse({
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
  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;
  try {
    await client.query({
      text: 'UPDATE invoices SET customer_id = $1, amount = $2, status = $3 WHERE id = $4',
      values: [customerId, amountInCents, status, id],
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleting(id: string) {
  // throw new Error('Failed to Delete Invoice');
  try {
    await client.query({
      text: 'UPDATE invoices SET isd=1 WHERE id = $1',
      values: [id],
    });
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
}
