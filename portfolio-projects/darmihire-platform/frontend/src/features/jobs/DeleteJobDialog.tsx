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

import type { Job } from "./types";

type Props = {
  open: boolean;
  job: Job | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeleteJobDialog({
  open,
  job,
  loading,
  onOpenChange,
  onConfirm,
}: Props) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete job?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete{" "}
            <strong>
              {job?.title}
            </strong>
            . Only draft jobs can be
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? "Deleting..."
              : "Delete job"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}