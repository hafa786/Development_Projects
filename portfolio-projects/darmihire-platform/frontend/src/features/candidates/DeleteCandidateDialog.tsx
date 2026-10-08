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

import type { Candidate } from "./types";

type DeleteCandidateDialogProps = {
  open: boolean;
  candidate: Candidate | null;
  loading?: boolean;

  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeleteCandidateDialog({
  open,
  candidate,
  loading,
  onOpenChange,
  onConfirm,
}: DeleteCandidateDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete candidate?
          </AlertDialogTitle>

          <AlertDialogDescription>
            {candidate ? (
              <>
                This will permanently delete{" "}
                <strong>
                  {candidate.fullName}
                </strong>{" "}
                from your candidate database.
              </>
            ) : (
              "This candidate will be permanently deleted."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading
              ? "Deleting..."
              : "Delete candidate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}