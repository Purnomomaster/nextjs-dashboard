'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { promises as fsPromises, mkdirSync } from 'fs';
import fs from 'fs';
import { existsSync } from 'fs';
import path from 'path';
import { getMenuById } from '@/app/lib/data';
import client from '../lib/db';

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
      values: [name, 'dashboard', name],
    });

    // If copyMenuId is provided, copy the menu
    if (copyMenuId) {
      const menu = await getMenuById(Number(copyMenuId));

      if (!menu) {
        return { ...prevState, message: 'Menu tidak ditemukan' };
      }

      // Path sumber & tujuan
      const sourcePath = path.join(
        process.cwd(),
        'app',
        'dashboard',
        menu.end.trim(),
      );
      const targetPath = path.join(
        process.cwd(),
        'app/dashboard/copied/',
        name.trim(),
      );
      // Cek apakah folder sumber ada
      if (!existsSync(sourcePath)) {
        return { ...prevState, message: 'Folder menu tidak ditemukan' };
      }
      try {
        console.log('Copying from:', sourcePath, 'to:', targetPath);
        if (existsSync(targetPath)) {
          return { ...prevState, message: `Folder ${name} sudah ada` };
        }
        // Salin folder
        await fsPromises.cp(sourcePath, targetPath, { recursive: true });
        console.log('Copy successful!');
        if (existsSync(targetPath)) {
          await processFolder({
            folderPath: targetPath,
            searchValue: menu.end.trim(),
            replaceValue: name.trim(),
          });
          console.log('✅ Semua file dalam folder telah diperbarui!');
        } else {
          console.error('❌ Folder tidak ditemukan:', targetPath);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Copy failed:', error.message);
        } else {
          console.error('Copy failed:', error);
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

async function replaceTextInFile({
  filePath,
  searchValue,
  replaceValue,
}: ReplaceTextInFileParams): Promise<void> {
  try {
    // Baca isi file
    let content = await fsPromises.readFile(filePath, 'utf8');

    // Ganti teks (lowercase)
    const regexLowercase = new RegExp(searchValue, 'g');
    content = content.replace(regexLowercase, replaceValue);

    // Ganti teks (capitalized)
    const searchValueCapitalized =
      searchValue.charAt(0).toUpperCase() + searchValue.slice(1);
    const replaceValueCapitalized =
      replaceValue.charAt(0).toUpperCase() + replaceValue.slice(1);
    const regexCapitalized = new RegExp(searchValueCapitalized, 'g');
    content = content.replace(regexCapitalized, replaceValueCapitalized);

    // Tulis kembali ke file
    await fsPromises.writeFile(filePath, content, 'utf8');

    console.log('Updated:', filePath);
  } catch (error) {
    console.error('Failed to modify file:', filePath, (error as Error).message);
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

async function processFolder({
  folderPath,
  searchValue,
  replaceValue,
}: ProcessFolderParams): Promise<void> {
  const files: FileType[] = (await fsPromises.readdir(folderPath, {
    withFileTypes: true,
  })) as FileType[];

  for (const file of files) {
    const fullPath = path.join(folderPath, file.name);

    if (file.isDirectory()) {
      // Jika folder, panggil fungsi ini lagi (rekursif)
      await processFolder({ folderPath: fullPath, searchValue, replaceValue });
    } else {
      // Jika file, ubah isinya
      await replaceTextInFile({
        filePath: fullPath,
        searchValue,
        replaceValue,
      });
    }
  }
}
