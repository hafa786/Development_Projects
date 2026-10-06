import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  Invitation,
} from "@/features/members/types";

type CancelInvitationDialogProps = {
  open: boolean;
  invitation: Invitation | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function CancelInvitationDialog({
  open,
  invitation,
  loading = false,
  onOpenChange,
  onConfirm,
}: CancelInvitationDialogProps) {
  if (!invitation) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Cancel invitation
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to cancel
            the invitation for{" "}
            <strong>
              {invitation.email}
            </strong>
            ? They will no longer be able to
            use this invitation to join the
            workspace.
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
            Keep invitation
          </Button>

          <Button
            variant="destructive"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? "Cancelling..."
              : "Cancel invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}