import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type AddDialogProps =
  | {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      contentForm: ReactNode;
      children?: never;
    }
  | {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      contentForm?: never;
      children: ReactNode;
    };

export const AddDialog = ({ open, onOpenChange, contentForm, children }: AddDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="font-semibold">Додати запис</DialogTitle>
        </DialogHeader>
        <ScrollArea
          className="max-h-[calc(80vh-4rem)] px-4 py-2"
          onWheel={(e) => {
            e.currentTarget.scrollBy({ top: e.deltaY * 0.5, left: 0 });
            e.preventDefault();
          }}
        >
          {contentForm ?? children}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
