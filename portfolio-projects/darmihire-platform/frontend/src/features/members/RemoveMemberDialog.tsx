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

import type { Member } from "./types";

type Props = {
  member: Member | null;
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function RemoveMemberDialog({
  member,
  open,
  loading = false,
  onOpenChange,
  onConfirm,
}: Props) {
  if (!member) {
    return null;
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove workspace member?
          </AlertDialogTitle>

          <AlertDialogDescription>
            <strong>
              {member.firstName}{" "}
              {member.lastName}
            </strong>{" "}
            will lose access to this
            workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            {loading
              ? "Removing..."
              : "Remove member"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}