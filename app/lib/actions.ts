"use server"

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { promises as fsPromises, mkdirSync } from 'fs';
import fs from 'fs';
import { existsSync } from 'fs';
import path from 'path';
import { getMenuById } from "@/app/lib/data";
const client = require('../lib/db');

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};
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
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.' }),
    date: z.string(),
});

// const PFormSchema = z.object({
//     id: z.string({
//         invalid_type_error: 'Please select a product id.',
//     }),
//     name: z.string({
//         invalid_type_error: 'Please select a product.',
//     }),
//     price: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
//     date: z.string(),
// });

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
const ProductSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please name a product.',
    }),
    price: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    date: z.string({
        invalid_type_error: 'Please select a date.',
    }),
    description: z.string().optional(),
    active: z.boolean().optional(),
    image: z.any().optional(), // Add image field to the schema
    file: z.any().optional(), // Add file field to the schema
});

const CreateProduct = ProductSchema;
export async function createProduct(prevState: ProductState, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateProduct.safeParse({
        name: formData.get('name'),
        price: formData.get('price'),
        date: formData.get('date'),
        description: formData.get('description'),
        active: formData.get('active') === 'on', // Convert checkbox value to boolean
    });
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
        const imagePath = path.join(process.cwd(), 'public/uploads', imageFile.name);
        await fsPromises.writeFile(imagePath, new Uint8Array(await imageFile.arrayBuffer()));
        imageUrl = `/uploads/${imageFile.name}`;
    }

    // Handle file upload
    const file = formData.get('file') as File;
    let fileUrl = '';
    if (file) {
        // Save the file to the public/uploads directory
        const filePath = path.join(process.cwd(), 'public/uploads', file.name);
        await fsPromises.writeFile(filePath, new Uint8Array(await file.arrayBuffer()));
        fileUrl = `/uploads/${file.name}`;
    }
    // Insert data into the database
    try {
        await client.query({
            text: 'INSERT INTO products (price, name, date, description, active, image_url, file_url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            values: [amountInCents, name, date, description, active, imageUrl, fileUrl],
        });
    } catch (error) {
        // Log the error details
        console.error('Database Error:', error);
        // If a database error occurs, return a more specific error.
        return {
            message: `Database Error: Failed to Create Product. ${error}`,
        };
    }

    // Revalidate the cache for the products page and redirect the user.
    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
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

const UpdateProduct = ProductSchema;
export async function updateProduct(id: string, prevState: ProductState, formData: FormData) {
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
    console.log(validatedFields.data)
    const amountInCents = price * 100;
    // Handle image upload
    const imageFile = formData.get('image') as File;
    let imageUrl = '';
    if (imageFile) {
        // Save the image to the public/uploads directory
        const imagePath = path.join(process.cwd(), 'public/uploads', imageFile.name);
        await fsPromises.writeFile(imagePath, new Uint8Array(await imageFile.arrayBuffer()));
        imageUrl = `/uploads/${imageFile.name}`;
    }

    // Handle file upload
    const file = formData.get('file') as File;
    let fileUrl = '';
    if (file) {
        // Save the file to the public/uploads directory
        const filePath = path.join(process.cwd(), 'public/uploads', file.name);
        await fsPromises.writeFile(filePath, new Uint8Array(await file.arrayBuffer()));
        fileUrl = `/uploads/${file.name}`;
    }
    try {
        await client.query({
            text: 'UPDATE products SET id = $1, price = $2, name = $3, date = $4, description = $5, active = $6, image_url = $7, file_url = $8 WHERE id = $9',
            values: [id, amountInCents, name, date, description, active, imageUrl, fileUrl, id],
        });
    } catch (error) {
        return {
            message: `Database Error: Failed to Update Product. ${error}`,
        };
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
            text: 'DELETE FROM products WHERE id = $1',
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

// export async function copyMenu(prevState: any, menuId: number) {
//     try {
//         const menu = await getMenuById(menuId);

//         if (!menu) {
//             return { ...prevState, message: "Menu tidak ditemukan" };
//         }

//         // Path sumber & tujuan
//         const sourcePath = path.join(process.cwd(), "app/dashboard", menu.endpoint);
//         const targetPath = path.join(process.cwd(), "app/dashboard/copied-menus", menu.endpoint);

//         // Cek apakah folder sumber ada
//         if (!existsSync(sourcePath)) {
//             return { ...prevState, message: "Folder menu tidak ditemukan" };
//         }

//         // Salin folder
//         fs.cpSync(sourcePath, targetPath, { recursive: true });

//         revalidatePath('/dashboard/menu');
//         return { ...prevState, message: "Menu berhasil disalin!" };
//     } catch (error) {
//         console.error('Error copying menu:', error);
//         const errorMessage = error instanceof Error ? error.message : 'Failed to copy menu.';
//         return { ...prevState, message: errorMessage };
//     }
// }
const MenuSchema = z.object({
    name: z.string({
        invalid_type_error: 'Please provide a menu name.',
    }),
    description: z.string().optional(),
    copyMenuId: z.string().optional(),
});

export async function createMenu(prevState: any, formData: FormData) {
    // Validate form using Zod
    const validatedFields = MenuSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        copyMenuId: formData.get('copyMenuId'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Menu.',
        };
    }

    // Prepare data for insertion into the database
    const { name, description, copyMenuId } = validatedFields.data;

    // Insert data into the database
    try {
        await client.query({
            text: 'INSERT INTO menu (title, dir, "end") VALUES ($1, $2, $3)',
            values: [name, "dashboard", name],
        });

        // If copyMenuId is provided, copy the menu
        if (copyMenuId) {
            const menu = await getMenuById(Number(copyMenuId));

            if (!menu) {
                return { ...prevState, message: "Menu tidak ditemukan" };
            }

            // Path sumber & tujuan
            const sourcePath = path.join(process.cwd(), "app", "dashboard", menu.end.trim());
            const targetPath = path.join(process.cwd(), "app/dashboard/copied/", name.trim());
            // Cek apakah folder sumber ada
            if (!existsSync(sourcePath)) {
                return { ...prevState, message: "Folder menu tidak ditemukan" };
            }
            try {
                console.log("Copying from:", sourcePath, "to:", targetPath);
                if (existsSync(targetPath)) {
                    return { ...prevState, message: `Folder ${name} sudah ada` };
                }
                // Salin folder
                await fsPromises.cp(sourcePath, targetPath, { recursive: true });
                console.log("Copy successful!");
                if (existsSync(targetPath)) {
                    await processFolder({ folderPath: targetPath, searchValue: menu.end.trim(), replaceValue: name.trim() });
                    console.log("✅ Semua file dalam folder telah diperbarui!");
                } else {
                    console.error("❌ Folder tidak ditemukan:", targetPath);
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Copy failed:", error.message);
                } else {
                    console.error("Copy failed:", error);
                }
            }
        }
    } catch (error) {
        // If a database error occurs, return a more specific error.
        console.log(error);
        return {
            message: `Database Error: Failed to Create Menu. ${error}`,
        };
    }

    // Revalidate the cache for the menus page and redirect the user.
    revalidatePath('/dashboard/menu');
    redirect('/dashboard/menu');
}

// Fungsi untuk mengganti teks dalam file
interface ReplaceTextInFileParams {
    filePath: string;
    searchValue: string;
    replaceValue: string;
}

async function replaceTextInFile({ filePath, searchValue, replaceValue }: ReplaceTextInFileParams): Promise<void> {
    try {
        // Baca isi file
        let content = await fsPromises.readFile(filePath, "utf8");

        // Ganti teks (lowercase)
        const regexLowercase = new RegExp(searchValue, 'g');
        content = content.replace(regexLowercase, replaceValue);

        // Ganti teks (capitalized)
        const searchValueCapitalized = searchValue.charAt(0).toUpperCase() + searchValue.slice(1);
        const replaceValueCapitalized = replaceValue.charAt(0).toUpperCase() + replaceValue.slice(1);
        const regexCapitalized = new RegExp(searchValueCapitalized, 'g');
        content = content.replace(regexCapitalized, replaceValueCapitalized);

        // Tulis kembali ke file
        await fsPromises.writeFile(filePath, content, "utf8");

        console.log("Updated:", filePath);
    } catch (error) {
        console.error("Failed to modify file:", filePath, (error as Error).message);
    }
}

// Fungsi untuk mendapatkan semua file dalam folder (termasuk subfolder)
interface FileType {
    name: string;
    isDirectory: () => boolean;
}
interface ProcessFolderParams {
    folderPath: string;
    searchValue: string;
    replaceValue: string;
}

async function processFolder({ folderPath, searchValue, replaceValue }: ProcessFolderParams): Promise<void> {
    const files: FileType[] = await fsPromises.readdir(folderPath, { withFileTypes: true }) as FileType[];

    for (const file of files) {
        const fullPath = path.join(folderPath, file.name);

        if (file.isDirectory()) {
            // Jika folder, panggil fungsi ini lagi (rekursif)
            await processFolder({ folderPath: fullPath, searchValue, replaceValue });
        } else {
            // Jika file, ubah isinya
            await replaceTextInFile({ filePath: fullPath, searchValue, replaceValue });
        }
    }
}