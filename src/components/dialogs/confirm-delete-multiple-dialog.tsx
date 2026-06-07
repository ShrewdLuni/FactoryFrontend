import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteMultipleDialog {
  isPending: boolean;
  selectedIds: string[];
  handleDeleteMultiple: () => void;
}

export const ConfirmDeleteMultipleDialog = ({ isPending, selectedIds, handleDeleteMultiple }: ConfirmDeleteMultipleDialog) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" size="sm" disabled={isPending}>
            <Trash className="h-4 w-4" />
            Видалити машини ({selectedIds.length})
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash />
          </AlertDialogMedia>
          <AlertDialogTitle>Видалити {selectedIds.length} машини?</AlertDialogTitle>
          <AlertDialogDescription>
            Це назавжди видалить вибрані машини ({selectedIds.length}) та пов’язану з ними інформацію.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Скасувати</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteMultiple} disabled={isPending}>
            Видалити
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
