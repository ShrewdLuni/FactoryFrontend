import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import type { ReactNode } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { DialogTitle } from "@radix-ui/react-dialog"

interface AddRecordDialogProps {
  open: boolean,
  onOpenChange: any,
  contentForm: ReactNode,
}

export const AddRecordDialog = ({ open, onOpenChange, contentForm } : AddRecordDialogProps) => {
  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>""</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(80vh-4rem)] px-4 py-2" onWheel={(e) => {e.currentTarget.scrollBy({ top: e.deltaY * 0.5, left: 0,}); e.preventDefault();}}>
          {contentForm}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
