import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type {
  Member,
  MembershipStatus,
} from "./types";

type Props = {
  member: Member | null;
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    status: MembershipStatus,
  ) => void;
};

export function ChangeMemberStatusDialog({
  member,
  open,
  loading = false,
  onOpenChange,
  onConfirm,
}: Props) {
  if (!member) {
    return null;
  }

  const isSuspended =
    member.status === "SUSPENDED";

  const newStatus: MembershipStatus =
    isSuspended
      ? "ACTIVE"
      : "SUSPENDED";

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
                Restore workspace access for{" "}
                <strong>
                  {member.firstName}{" "}
                  {member.lastName}
                </strong>
                ?
              </>
            ) : (
              <>
                Suspend workspace access for{" "}
                <strong>
                  {member.firstName}{" "}
                  {member.lastName}
                </strong>
                ?
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
            disabled={loading}
            variant={
              isSuspended
                ? "default"
                : "destructive"
            }
            onClick={() =>
              onConfirm(newStatus)
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