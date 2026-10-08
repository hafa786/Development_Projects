import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { JobApplication } from "./types";

type RejectApplicationDialogProps = {
  open: boolean;
  application: JobApplication | null;
  submitting?: boolean;

  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
};

export function RejectApplicationDialog({
  open,
  application,
  submitting = false,
  onOpenChange,
  onConfirm,
}: RejectApplicationDialogProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReason("");
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Reject application?
          </DialogTitle>

          <DialogDescription>
            {application
              ? `Reject ${application.candidateFullName}'s application for ${application.jobTitle}.`
              : "Reject this application."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejectionReason">
            Rejection reason
          </Label>

          <Textarea
            id="rejectionReason"
            rows={5}
            maxLength={1000}
            value={reason}
            onChange={(event) =>
              setReason(event.target.value)
            }
            placeholder="Optional internal reason..."
          />

          <p className="text-right text-xs text-muted-foreground">
            {reason.length}/1000
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={submitting}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={submitting}
            onClick={() =>
              onConfirm(reason.trim())
            }
          >
            {submitting
              ? "Rejecting..."
              : "Reject application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}