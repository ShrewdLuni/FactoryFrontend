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

interface ConfirmDeleteManyDialog {
  isPending: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  handlePatchMany: () => void;
}

export const ConfirmEditManyDialog = ({ isPending, open, onOpenChange, selectedIds, handlePatchMany}: ConfirmDeleteManyDialog) => {
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
          <AlertDialogAction onClick={handlePatchMany} disabled={isPending}>Підтвердити</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

