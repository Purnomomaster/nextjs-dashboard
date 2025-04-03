'use server';
import { unstable_noStore as noStore } from 'next/cache';
import { Authority } from '@/app/lib/definitions';
import { revalidatePath } from 'next/cache';
import client from '../../lib/db';
import { auth } from "@/auth";

// This action will process the selected menu IDs
export async function updateAuthority(selectedMenuIds: number[]) {
  try {
    const session = await auth();
    // Get user ID and name
    const userId = session?.user?.id;
    const userName = session?.user?.name;

    // 1. Ambil semua idmenu yang terkait dengan iduserm
    const existingMenuIdsResult = await client.query(
      `SELECT id FROM menu WHERE isd=0`
    );
    const existingMenuIds = existingMenuIdsResult.rows.map((row: { id: number }) => row.id.toString());

    // 2. Tentukan idmenu yang tidak dipilih
    const unselectedMenuIds = existingMenuIds.map(Number).filter(
      (menuId: number) => !selectedMenuIds.includes(menuId)
    );

    console.log(selectedMenuIds);
    console.log("breaks");
    console.log(unselectedMenuIds);

    // 3. Perbarui idmenu yang tidak dipilih menjadi see = 0
    if (unselectedMenuIds.length > 0) {
      await client.query(`
        UPDATE authority
        SET see = 0`);
      for (let unselectedMenuId of unselectedMenuIds) {
        // unselectedMenuId = Number(unselectedMenuId);
        // console.log("unselectedMenuId: after convert");
        console.log(unselectedMenuId);
        await client.query(`
          INSERT INTO authority (idmenu, see, iduserm, userm)
          VALUES (${unselectedMenuId}, 0, '${userId}', '${userName}')
          ON CONFLICT (idmenu) 
          DO UPDATE SET see = 0
        `);
      }
    }


    // For each selected menu ID, we'll perform an upsert operation
    for (let menuId of selectedMenuIds) {
      // Using PostgreSQL's ON CONFLICT for upsert operation
      // This will insert a new row if the menuId doesn't exist,
      // or update the value to 1 if it already exists
      // menuId = Number(menuId);
      // console.log("MenuId: after convert");
        console.log(menuId);
      await client.query(`
          INSERT INTO authority (idmenu, see, iduserm, userm)
          VALUES (${menuId}, 1, '${userId}', '${userName}')
          ON CONFLICT (idmenu) 
          DO UPDATE SET see = 1
        `);
    }

    // Revalidate the path to refresh the data
    revalidatePath("/")
    return { success: true, message: "Menu selections saved successfully" }
  } catch (error) {
    console.error("Error processing menu selections:", error)
    return { success: false, message: "Failed to save menu selections" }
  }
}

export async function fetchAuthoritys(query: string) {
  noStore();
  try {
    const data = await client.query(
      `
      SELECT
        authority.id,
        authority.idmenu,
        authority.see
      FROM authority
      WHERE
        authority.idmenu LIKE $1
    `,
      [`%${query}%`],
    );

    return data.rows as Authority[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch authority.');
  }
}

export async function fetchAuthority(query: string) {
  noStore();
  try {
    const data = await client.query(
      `
      SELECT
        authority.id,
        authority.idmenu,
        authority.see
      FROM authority
      WHERE
        authority.id = $1
    `,
      [query],
    );

    return data.rows[0] as Authority;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch authority.');
  }
}
