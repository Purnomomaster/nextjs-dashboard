'use server';
import { unstable_noStore as noStore } from 'next/cache';
import { Product } from '@/app/lib/definitions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { promises as fsPromises } from 'fs';
import path from 'path';
import client from '../../lib/db';

// Define the State type
type ProductState = {
    errors?: {
        id?: string[];
        name?: string[];
        price?: string[];
        date?: string[];
        description?: string[];
        active?: string[];
        image?: string[];
        file?: string[];
    };
    message: string;
};

const ProductSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please name a product.',
    }),
    price: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    date: z.string({
        invalid_type_error: 'Please select a date.',
    }),
    description: z.string().optional(),
    active: z.boolean().optional(),
    image: z.any().optional(), // Add image field to the schema
    file: z.any().optional(), // Add file field to the schema
});

const CreateProduct = ProductSchema.omit({ id: true });
export async function createProduct(
    prevState: ProductState,
    formData: FormData,
) {
    // Validate form using Zod
    const validatedFields = CreateProduct.safeParse({
        name: formData.get('name'),
        price: formData.get('price'),
        date: formData.get('date'),
        description: formData.get('description'),
        active: formData.get('active') === 'on', // Convert checkbox value to boolean
    });
    console.log(formData);
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Product.',
        };
    }

    // Prepare data for insertion into the database
    const { name, price, date, description, active } = validatedFields.data;
    console.log(validatedFields.data);
    const amountInCents = price * 100;

    // Handle image upload
    const imageFile = formData.get('image') as File;
    let imageUrl = '';
    if (imageFile) {
        // Save the image to the public/uploads directory
        const imagePath = path.join(
            process.cwd(),
            'public/uploads',
            imageFile.name,
        );
        await fsPromises.writeFile(
            imagePath,
            new Uint8Array(await imageFile.arrayBuffer()),
        );
        imageUrl = `/uploads/${imageFile.name}`;
    }

    // Handle file upload
    const file = formData.get('file') as File;
    let fileUrl = '';
    if (file) {
        // Save the file to the public/uploads directory
        const filePath = path.join(process.cwd(), 'public/uploads', file.name);
        await fsPromises.writeFile(
            filePath,
            new Uint8Array(await file.arrayBuffer()),
        );
        fileUrl = `/uploads/${file.name}`;
    }
    // Insert data into the database
    try {
        await client.query({
            text: 'INSERT INTO product (price, name, date, description, active, image_url, file_url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            values: [
                amountInCents,
                name,
                date,
                description,
                active,
                imageUrl,
                fileUrl,
            ],
        });
    } catch (error) {
        // Log the error details
        console.error('Database Error:', error);
        // If a database error occurs, return a more specific error.
        return {
            message: `Database Error: Failed to Create Product. ${error}`,
        };
    }

    // Revalidate the cache for the product page and redirect the user.
    revalidatePath('/dashboard/product');
    redirect('/dashboard/product');
}

const UpdateProduct = ProductSchema;
export async function updateProduct(
    id: string,
    prevState: ProductState,
    formData: FormData,
) {
    const validatedFields = UpdateProduct.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        price: formData.get('price'),
        date: formData.get('date'),
        description: formData.get('description'),
        active: formData.get('active') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Product.',
        };
    }
    const { name, price, date, description, active } = validatedFields.data;
    console.log(validatedFields.data);
    const amountInCents = price * 100;
    // Handle image upload
    const imageFile = formData.get('image') as File;
    let imageUrl = '';
    if (imageFile) {
        // Save the image to the public/uploads directory
        const imagePath = path.join(
            process.cwd(),
            'public/uploads',
            imageFile.name,
        );
        await fsPromises.writeFile(
            imagePath,
            new Uint8Array(await imageFile.arrayBuffer()),
        );
        imageUrl = `/uploads/${imageFile.name}`;
    }

    // Handle file upload
    const file = formData.get('file') as File;
    let fileUrl = '';
    if (file) {
        // Save the file to the public/uploads directory
        const filePath = path.join(process.cwd(), 'public/uploads', file.name);
        await fsPromises.writeFile(
            filePath,
            new Uint8Array(await file.arrayBuffer()),
        );
        fileUrl = `/uploads/${file.name}`;
    }
    try {
        await client.query({
            text: 'UPDATE product SET id = $1, price = $2, name = $3, date = $4, description = $5, active = $6, image_url = $7, file_url = $8 WHERE id = $9',
            values: [
                id,
                amountInCents,
                name,
                date,
                description,
                active,
                imageUrl,
                fileUrl,
                id,
            ],
        });
    } catch (error) {
        return {
            message: `Database Error: Failed to Update Product. ${error}`,
        };
    }

    revalidatePath('/dashboard/product');
    redirect('/dashboard/product');
}

export async function deleteProduct(id: string) {
    try {
        await client.query({
            text: 'DELETE FROM product WHERE id = $1',
            values: [id],
        });
        revalidatePath('/dashboard/product');
        return { message: 'Deleted product.' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete product.',
        };
    }
}

export async function fetchProducts(query: string) {
    noStore();
    try {
        const data = await client.query(
            `
      SELECT
        product.id,
        product.name,
        product.price
      FROM product
      WHERE
        product.name LIKE $1
    `,
            [`%${query}%`],
        );

        return data.rows as Product[];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch product.');
    }
}

export async function fetchProduct(query: string) {
    noStore();
    try {
        const data = await client.query(
            `
      SELECT
        product.id,
        product.name,
        product.price
      FROM product
      WHERE
        product.id = $1
    `,
            [query],
        );

        return data.rows[0] as Product;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch product.');
    }
}
