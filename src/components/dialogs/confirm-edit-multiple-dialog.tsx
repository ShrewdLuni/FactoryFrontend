import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteMultipleDialog {
  isPending: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  handlePatchMultiple: () => void;
}

export const ConfirmEditMultipleDialog = ({ isPending, open, onOpenChange, selectedIds, handlePatchMultiple }: ConfirmDeleteMultipleDialog) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Редагувати {selectedIds.length} машини?</AlertDialogTitle>
          <AlertDialogDescription>
            Ви впевнені, що хочете редагувати {selectedIds.length} машин?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Скасувати</AlertDialogCancel>
          <AlertDialogAction onClick={handlePatchMultiple} disabled={isPending}>Підтвердити</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

