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

import type {
  Job,
  JobStatus,
} from "./types";

type Props = {
  open: boolean;
  job: Job | null;
  status: JobStatus | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

function label(status: JobStatus | null) {
  if (!status) return "";

  return status
    .toLowerCase()
    .replace("_", " ");
}

export function JobStatusDialog({
  open,
  job,
  status,
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
            Change job status?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Change{" "}
            <strong>
              {job?.title}
            </strong>{" "}
            from{" "}
            {job?.status.toLowerCase()} to{" "}
            {label(status)}?
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
              ? "Updating..."
              : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}