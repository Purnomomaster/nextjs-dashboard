"use client"

import type React from "react"

import { useState } from "react"
import { useActionState } from "react"
import { createMenu } from "@/app/model/menu/action"
import type { Menu } from "@/app/lib/definitions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/app/ui/button"
import { PlusIcon } from "lucide-react"
import * as HeroIcons from "@heroicons/react/24/outline"

// Get all icons that are actually React components
const iconNames = Object.entries(HeroIcons)
  .filter(([_, Component]) => Component?.$$typeof === Symbol.for("react.forward_ref"))
  .map(([name]) => name)

interface CreateMenuDialogProps {
  menus: Menu[]
  highestLv1: number
  highestLv2?: number
  parentLv1?: number
  buttonSize?: "default" | "icon"
  className?: string
  btnname?: string
}

interface State {
  message: string
  errors: {
    name?: string[]
    description?: string[]
    end?: string[]
    idfrom?: string[]
    icon?: string[]
    lv1?: string[]
    lv2?: string[]
    lv3?: string[]
  }
}

export function CreateMenuDialog({
  menus,
  highestLv1 = 0,
  highestLv2 = 0,
  parentLv1,
  buttonSize = "default",
  className = "",
  btnname = "",
}: CreateMenuDialogProps) {
  const [open, setOpen] = useState(false)
  const initialState: State = { message: "", errors: {} }
  const [state, dispatch] = useActionState(createMenu, initialState)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    end: "",
    idfrom: "",
    icon: "",
    lv1: parentLv1 !== undefined ? parentLv1 : highestLv1 + 1, // Use parentLv1 if provided, otherwise use highestLv1 + 1
    lv2: parentLv1 !== undefined ? highestLv2 + 1 : 0, // If parentLv1 is provided, use highestLv2 + 1, otherwise 0
    lv3: 0,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (formData: FormData) => {
    dispatch(formData)
    if (!state.errors || Object.keys(state.errors).length === 0) {
      setOpen(false)
    }
  }

  // Dynamically render the selected icon
  const SelectedIcon = formData.icon ? HeroIcons[formData.icon as keyof typeof HeroIcons] : null

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-1">
        <PlusIcon className="h-4 w-4" />
        <span> {btnname}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New {btnname} Menu</DialogTitle>
          </DialogHeader>

          <form action={handleSubmit}>
            <div className="rounded-md p-4">
              {/* Menu Name */}
              <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Menu Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="name-error"
                  required
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
                  value={formData.description}
                  onChange={handleInputChange}
                  className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
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

               {/* Menu Endpoint */}
               <div className="mb-4">
                <label htmlFor="end" className="mb-2 block text-sm font-medium">
                  Endpoint
                </label>
                <input
                  id="end"
                  name="end"
                  type="text"
                  value={formData.end}
                  onChange={handleInputChange}
                  className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="end-error"
                />
                <div id="end-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.end &&
                    state.errors.end.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>

              {/* Copy Menu ID */}
              <div className="mb-4">
                <label htmlFor="idfrom" className="mb-2 block text-sm font-medium">
                  Copy Menu ID
                </label>
                <select
                  id="idfrom"
                  name="idfrom"
                  value={formData.idfrom}
                  onChange={handleInputChange}
                  className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="idfrom-error"
                >
                  <option value="">Select a menu to copy</option>
                  {menus.map((menuItem) => (
                    <option key={menuItem.id} value={menuItem.id}>
                      {menuItem.name}
                    </option>
                  ))}
                </select>
                <div id="idfrom-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.idfrom &&
                    state.errors.idfrom.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Icon</label>
                <Select value={formData.icon} onValueChange={(value) => handleSelectChange("icon", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an icon">
                      {formData.icon && (
                        <div className="flex items-center">
                          {SelectedIcon && <SelectedIcon className="h-4 w-4 mr-2" />}
                          <span>{formData.icon}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="none">None</SelectItem>
                    {iconNames.map((iconName) => {
                      const Icon = HeroIcons[iconName as keyof typeof HeroIcons]
                      return (
                        <SelectItem key={iconName} value={iconName}>
                          <div className="flex items-center">
                            <Icon className="h-4 w-4 mr-2" />
                            <span>{iconName}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <input type="hidden" name="icon" value={formData.icon} />
                <div id="icon-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.icon &&
                    state.errors.icon.map((error: string) => (
                      <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>

              {/* Menu Level Inputs */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Level 1 */}
                <div>
                  <label htmlFor="lv1" className="mb-2 block text-sm font-medium">
                    Level 1
                  </label>
                  <input
                    id="lv1"
                    name="lv1"
                    type="number"
                    value={formData.lv1}
                    onChange={handleInputChange}
                    className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="lv1-error"
                  />
                  <div id="lv1-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.lv1 &&
                      state.errors.lv1.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>

                {/* Level 2 */}
                <div>
                  <label htmlFor="lv2" className="mb-2 block text-sm font-medium">
                    Level 2
                  </label>
                  <input
                    id="lv2"
                    name="lv2"
                    type="number"
                    value={formData.lv2}
                    onChange={handleInputChange}
                    className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="lv2-error"
                  />
                  <div id="lv2-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.lv2 &&
                      state.errors.lv2.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>

                {/* Level 3 */}
                <div>
                  <label htmlFor="lv3" className="mb-2 block text-sm font-medium">
                    Level 3
                  </label>
                  <input
                    id="lv3"
                    name="lv3"
                    type="number"
                    value={formData.lv3}
                    onChange={handleInputChange}
                    className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="lv3-error"
                  />
                  <div id="lv3-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.lv3 &&
                      state.errors.lv3.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                          {error}
                        </p>
                      ))}
                  </div>
                </div>
              </div>

              <div id="form-error" aria-live="polite" aria-atomic="true">
                {state.message && <p className="mt-2 text-sm text-red-500">{state.message}</p>}
              </div>
            </div>

            <DialogFooter className="mt-6 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Menu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

