"use client"

import { useState } from "react"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteFile } from "@/app/model/menu/action"

interface DeleteFileButtonProps {
  id: number
  name: string
  onSuccess?: () => void
}

export function DeleteFileButton({ id, name, onSuccess }: DeleteFileButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setError(null)

      const result = await deleteFile(id)

      if (result.success) {
        setIsOpen(false)
        if (onSuccess) onSuccess()
      } else {
        setError(result.message || "Failed to delete file")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
        <DialogTitle>Are you sure you want to delete "{name}"?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the file from the server.
          </DialogDescription>
        </DialogHeader>

        {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">{error}</div>}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

