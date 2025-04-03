"use client"

import { useState, useEffect } from "react"
import { Menu } from '@/app/lib/definitions';
import { Button } from "@/components/ui/button"
import { updateAuthority, fetchAuthoritys } from "@/app/model/authority/action";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export default function Table({
  menus,
}: {
  menus: Menu[];
}) {

  // State to track checked menus
  const [checkedMenus, setCheckedMenus] = useState<Record<number, boolean>>({})
  const [selectAll, setSelectAll] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Initialize checkedMenus state based on menus
  useEffect(() => {
    const fetchCheckedMenus = async () => {
      const authoritys = await fetchAuthoritys('');
      const checkedMenus = authoritys.reduce((acc, authority) => {
        if (authority.see === 1) {
          acc[Number(authority.idmenu.trim())] = true;
        }
        return acc;
      }, {});
      setCheckedMenus(checkedMenus);
    };
    fetchCheckedMenus();
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (menuId: number) => {
    setCheckedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
  }
  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    // Create a new object with all menus set to the new selectAll value
    const newCheckedMenus: Record<number, boolean> = {}
    menus.forEach((menu) => {
      newCheckedMenus[menu.id] = newSelectAll
    })

    setCheckedMenus(newCheckedMenus)
  }

  // Add this after the state declarations
  // Update selectAll state when all checkboxes are checked or unchecked
  useEffect(() => {
    if (menus.length === 0) return

    const allChecked = menus.every((menu) => checkedMenus[menu.id])
    if (allChecked !== selectAll) {
      setSelectAll(allChecked)
    }
  }, [checkedMenus, menus, selectAll])

  // Handle save button click
  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Get all checked menu IDs
      const selectedMenuIds = Object.entries(checkedMenus)
        .filter(([_, isChecked]) => isChecked)
        .map(([id]) => id)

      if (selectedMenuIds.length === 0) {
        toast({
          title: "No items selected",
          description: "Please select at least one menu item to save.",
          variant: "destructive",
        })
        return
      }

      // Call the server action to process the selected menu IDs
      const result = await updateAuthority(selectedMenuIds.map(Number))

      if (result.success) {
        toast({
          title: "Success",
          description: `Saved ${selectedMenuIds.length} selected items`,
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save selected items",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving menu selections:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-5 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-5 text-left text-sm font-semibold text-gray-900">
                    See
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      className="ml-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {menus.map((menu) => {

                  return (
                    <tr key={menu.id} className="group">
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">{menu.name.trim()}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                        <input
                          type="checkbox"
                          id={`menu-${menu.id}`}
                          checked={checkedMenus[menu.id] || false}
                          onChange={() => handleCheckboxChange(menu.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end px-4 py-2">
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>

            <Toaster />

          </div>
        </div>
      </div>
    </div>
  );
}
