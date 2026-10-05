import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Member } from "@/features/members/types";

type RemoveMemberDialogProps = {
  open: boolean;
  member: Member | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function RemoveMemberDialog({
  open,
  member,
  loading = false,
  onOpenChange,
  onConfirm,
}: RemoveMemberDialogProps) {
  if (!member) {
    return null;
  }

  const memberName =
    `${member.firstName} ${member.lastName}`.trim();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Remove workspace member
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to remove{" "}
            <strong>{memberName}</strong>{" "}
            from this workspace? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? "Removing..."
              : "Remove member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}