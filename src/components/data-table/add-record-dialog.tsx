import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ReactNode } from "react"

interface AddRecordDialogProps {
  open: boolean,
  onOpenChange: any,
  contentForm: ReactNode,
}

export const AddRecordDialog = ({ open, onOpenChange, contentForm } : AddRecordDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
        </DialogHeader>
        {contentForm}
      </DialogContent>
    </Dialog>
  )
}
