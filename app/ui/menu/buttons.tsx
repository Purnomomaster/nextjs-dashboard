"use client"
import Link from 'next/link';
// import { Button } from '@/app/ui/button';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteMenu } from '../../model/menu/action';

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popup } from "./popup"

export default function CreateMenu() {
    return (
        <Link href="/dashboard/menu/create">
            <Button>Create Menu</Button>
        </Link>
    );
}

export function DeleteMenu({ id }: { id: number }) {
  const deleteMenuWithId = deleteMenu.bind(null, id);
  return (
    <>
      <form action={deleteMenuWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
export function PopupInputButton() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open Input</Button>
      <Popup open={open} onOpenChange={setOpen} value={value} onValueChange={handleValueChange} />
      {value && (
        <div className="mt-4 p-4 border rounded-md">
          <p>
            Submitted value: <span className="font-medium">{value}</span>
          </p>
        </div>
      )}
    </div>
  )
}


