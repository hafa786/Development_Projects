import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

export function DeclineOfferDialog({
  loading = false,
  onConfirm,
}: {
  loading?: boolean;

  onConfirm: (reason?: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Decline
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Candidate declined</DialogTitle>

          <DialogDescription>
            Record the candidate's decision. The reason is optional.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          rows={5}
          value={reason}
          placeholder="Optional reason..."
          onChange={(event) => setReason(event.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={loading}
            onClick={async () => {
              await onConfirm(reason.trim() || undefined);

              setReason("");
              setOpen(false);
            }}
          >
            Confirm decline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
