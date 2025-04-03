'use server';
import { unstable_noStore as noStore } from 'next/cache';
import { auth } from "@/auth";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';
import client from '../../lib/db';

const MenuSchema = z.object({
    id: z.string().min(1, "Menu ID is required"),
    name: z.string().min(1, "Menu name is required"),
    description: z.string().min(1, "Description is required"),
    end: z.string().optional(),
    idfrom: z.string().optional(),
    icon: z.string().optional(),
    lv1: z.coerce.number().int().optional(),
    lv2: z.coerce.number().int().optional(),
    lv3: z.coerce.number().int().optional(),
});
const CreateMenu = MenuSchema.omit({ id: true });
export async function createMenu(prevState: any, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateMenu.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        idfrom: formData.get("idfrom"),
        end: formData.get("end"),
        icon: formData.get("icon"),
        lv1: formData.get("lv1"),
        lv2: formData.get("lv2"),
        lv3: formData.get("lv3"),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Menu.',
        };
    }

    // Prepare data for insertion into the database
    const { name, description, idfrom, end, icon, lv1, lv2, lv3 } = validatedFields.data;
    const exist = await getMenuByName(String(name));

    if (exist) {
        return { ...prevState, message: 'Menu sudah ada' };
    }
    // console.log(validatedFields.data);
    // return {
    //     errors: "",
    //     message: 'tes lihat console.',
    // };

    try {
        // If copyMenuId is provided, copy the menu
        if (idfrom) {
            const menu = await getMenuById(Number(idfrom));

            if (!menu) {
                return { ...prevState, message: 'Menu tidak ditemukan' };
            }
            // Folder yang akan disalin
            const foldersToCopy = ['dashboard', 'model', 'ui'];

            // 🔍 **1. Cek apakah semua folder sumber ada sebelum copy dimulai**
            const missingSourceFolders = foldersToCopy.filter(folder =>
                !existsSync(path.join(process.cwd(), 'app', folder, menu.end.trim()))
            );

            if (missingSourceFolders.length > 0) {
                console.error(`❌ Folder sumber berikut tidak ditemukan: ${missingSourceFolders.join(', ')}`);
                return { ...prevState, message: `Folder sumber tidak lengkap: ${missingSourceFolders.join(', ')}` };
            }

            // 🔍 **2. Cek apakah semua folder tujuan sudah ada sebelum mulai copy**
            const existingTargetFolders = foldersToCopy.filter(folder =>
                existsSync(path.join(process.cwd(), `app/${folder}/copied/`, name.trim()))
            );

            if (existingTargetFolders.length > 0) {
                console.error(`❌ Folder tujuan berikut sudah ada: ${existingTargetFolders.join(', ')}`);
                return { ...prevState, message: `Folder tujuan sudah ada: ${existingTargetFolders.join(', ')}` };
            }

            try {
                for (const folder of foldersToCopy) {
                    const sourcePath = path.join(
                        process.cwd(),
                        'app',
                        folder,
                        menu.end.trim(),
                    );
                    const targetPath = path.join(
                        process.cwd(),
                        `app/${folder}/`,
                        end,
                    );
                    // Jika folder tujuan belum ada, buat dulu
                    if (!existsSync(targetPath)) {
                        console.log(`📂 Folder tujuan ${folder}/${end} belum ada, membuatnya...`);
                        await fsPromises.mkdir(targetPath, { recursive: true });
                    }
                    console.log('Copying from:', sourcePath, 'to:', targetPath);
                    // Salin folder
                    await fsPromises.cp(sourcePath, targetPath, { recursive: true });
                    console.log('Copy successful!');
                    await processFolder({
                        folderPath: targetPath,
                        searchValue: menu.end.trim(),
                        replaceValue: end,
                    });
                    console.log('✅ Semua file dalam folder telah diperbarui!');
                }

                await client.query(`
                    CREATE TABLE IF NOT EXISTS ${end} (LIKE ${menu.end.trim()} INCLUDING ALL);
                `);
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Copy failed:', error.message);
                } else {
                    console.error('Copy failed:', error);
                }
            }
        }
        const session = await auth();

        // Get user ID and name
        const userId = session?.user?.id;
        const userName = session?.user?.name;
        // Insert data into the database
        await client.query({
            text: 'INSERT INTO menu (name, dir, description, "end", idfrom, icon, lv1, lv2, lv3, iduserc, userc, isd) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
            values: [name, 'dashboard', description, end, idfrom ?? "", icon, lv1, lv2, lv3, userId, userName, 0],
        });
    } catch (error) {
        // If a database error occurs, return a more specific error.
        console.log(error);
        return {
            message: `Database Error: Failed to Create Menu. ${error}`,
        };
    }

    // Revalidate the cache for the menus page and redirect the user.
    revalidatePath('/dashboard');
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


export async function deleteMenu(id: number) {
    const session = await auth();

    // Get user ID and name
    const userId = session?.user?.id;
    const userName = session?.user?.name;

    try {
        await client.query({
            text: 'UPDATE menu SET deleted = NOW(), isd = 1, userd = $1, iduserd = $2  WHERE id = $3',
            values: [userName, userId, id],
        });
        revalidatePath('/dashboard/menu');
        return { message: 'Deleted menu.' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete menu.',
        };
    }
}


// Ambil semua menu
export async function fetchMenus(query: string = '') {
    noStore();
    try {
        const result = await client.query(
            'SELECT * FROM menu WHERE isd=0 and "end" LIKE $1 ORDER BY lv1 ASC, created DESC', [`%${query}%`],
        );
        return result.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch menus.');
    }
}

// Ambil menu berdasarkan ID
export async function getMenuById(menuId: number) {
    try {
        const result = await client.query('SELECT * FROM menu WHERE id = $1 and isd=0', [
            menuId,
        ]);
        return result.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch menu by ID.');
    }
}
// Ambil menu berdasarkan Nama
export async function getMenuByName(menuName: string) {
    try {
        const result = await client.query('SELECT * FROM menu WHERE name = $1 and isd=0', [
            menuName,
        ]);
        return result.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch menu by Name.');
    }
}

// Updated updateMenu action with new fields
export async function updateMenu(prevState: any, formData: FormData) {
    const schema = z.object({
        id: z.string().min(1, "Menu ID is required"),
        name: z.string().min(1, "Menu name is required"),
        description: z.string().min(1, "Description is required"),
        end: z.string().min(1, "Endpoint is required"),
        idfrom: z.string().optional(),
        icon: z.string().optional(),
        lv1: z.coerce.number().int().optional(),
        lv2: z.coerce.number().int().optional(),
        lv3: z.coerce.number().int().optional(),
    });

    const validatedFields = schema.safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        description: formData.get("description"),
        idfrom: formData.get("idfrom"),
        end: formData.get("end"),
        icon: formData.get("icon"),
        lv1: formData.get("lv1"),
        lv2: formData.get("lv2"),
        lv3: formData.get("lv3"),
    });

    if (!validatedFields.success) {
        return {
            message: "Missing Fields. Failed to update menu.",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { id, name, description, end, idfrom, icon, lv1, lv2, lv3 } = validatedFields.data


    console.log(validatedFields.data);

    try {
        const session = await auth();

        // Get user ID and name
        const userId = session?.user?.id;
        const userName = session?.user?.name;
        // Your database update logic here
        // For example: await db.menu.update({ where: { id }, data: { title: name, description } })
        await client.query({
            text: 'UPDATE menu SET name = $1, description = $2, idfrom = $3, icon = $4, lv1 = $5, lv2 = $6, lv3 = $7, iduserm = $8, userm = $9  WHERE id = $10',
            values: [name, description, idfrom, icon, lv1, lv2, lv3, userId, userName, id],
        });

        revalidatePath("/dashboard/menu")
        return { message: "Menu updated successfully", errors: {} }
    } catch (error) {
        console.error("Database Error:", error);
        return { message: "Database Error: Failed to update menu.", errors: {} }
    }
}

export async function deleteFile(id: number) {
    const menu = await getMenuById(Number(id));
    if (!menu) {
        return { success: false, message: 'Menu tidak ditemukan' };
    }
    const foldersToDelete = ['dashboard', 'model', 'ui'];
    const menuEndName = menu.end.trim()
    // 🔍 **1. Cek apakah semua folder yg didelete ada **
    const missingSourceFolders = foldersToDelete.filter(folder =>
        !existsSync(path.join(process.cwd(), 'app', folder, menuEndName))
    );
    if (missingSourceFolders.length > 0) {
        console.error(`❌ Folder sumber berikut tidak ditemukan: ${missingSourceFolders.join(', ')}`);
        return { success: false, message: `Folder yang akan didelete tidak lengkap: ${missingSourceFolders.join(', ')}` };
    }
    try {

        // Delete all existing folders
        const deletionPromises = foldersToDelete.map(async (folder) => {
            const folderPath = path.join(process.cwd(), "app", folder, menuEndName)

            if (existsSync(folderPath)) {
                console.log(`🗑️ Deleting folder: ${folderPath}`)
                try {
                    // Use recursive deletion to remove all files and subdirectories
                    await fsPromises.rm(folderPath, { recursive: true, force: true })
                    console.log(`✅ Successfully deleted: ${folderPath}`)
                    return { folder, success: true }
                } catch (error) {
                    console.error(`❌ Failed to delete ${folderPath}:`, error)
                    return { folder, success: false, error }
                }
            } else {
                console.log(`⚠️ Folder doesn't exist, skipping: ${folderPath}`)
                return { folder, success: true, skipped: true }
            }
        })

        // Wait for all deletion operations to complete
        const deletionResults = await Promise.all(deletionPromises)

        // Check if any deletions failed
        const failedDeletions = deletionResults.filter((result) => !result.success)

        if (failedDeletions.length > 0) {
            const failedFolders = failedDeletions.map((result) => result.folder).join(", ")
            return {
                success: false,
                message: `Failed to delete some folders: ${failedFolders}`,
            }
        }

        revalidatePath('/dashboard/menu');

        return {
            success: true,
            message: "File deleted successfully",
        }
    } catch (error) {
        console.error("Error deleting file:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete file",
        }
    }
}