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
  Member,
  MembershipStatus,
} from "@/features/members/types";

type ChangeMemberStatusDialogProps = {
  open: boolean;
  member: Member | null;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    status: MembershipStatus,
  ) => void;
};

export function ChangeMemberStatusDialog({
  open,
  member,
  loading = false,
  onOpenChange,
  onConfirm,
}: ChangeMemberStatusDialogProps) {
  if (!member) {
    return null;
  }

  const isSuspended =
    member.status === "SUSPENDED";

  const nextStatus: MembershipStatus =
    isSuspended
      ? "ACTIVE"
      : "SUSPENDED";

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
            {isSuspended
              ? "Activate member"
              : "Suspend member"}
          </DialogTitle>

          <DialogDescription>
            {isSuspended ? (
              <>
                Activate{" "}
                <strong>
                  {memberName}
                </strong>
                ? They will regain workspace
                access.
              </>
            ) : (
              <>
                Suspend{" "}
                <strong>
                  {memberName}
                </strong>
                ? They will no longer have
                active workspace access.
              </>
            )}
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
            variant={
              isSuspended
                ? "default"
                : "destructive"
            }
            disabled={loading}
            onClick={() =>
              onConfirm(nextStatus)
            }
          >
            {loading
              ? "Saving..."
              : isSuspended
                ? "Activate"
                : "Suspend"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}