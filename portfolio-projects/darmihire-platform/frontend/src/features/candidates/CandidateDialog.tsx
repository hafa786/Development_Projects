import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CandidateForm } from "./CandidateForm";

import type { Candidate } from "./types";
import type { CandidateFormValues } from "./schemas";

type CandidateDialogProps = {
  open: boolean;
  candidate?: Candidate | null;
  submitting?: boolean;

  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CandidateFormValues) => void;
};

export function CandidateDialog({
  open,
  candidate,
  submitting,
  onOpenChange,
  onSubmit,
}: CandidateDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {candidate
              ? "Edit candidate"
              : "Add candidate"}
          </DialogTitle>

          <DialogDescription>
            {candidate
              ? "Update candidate profile and contact information."
              : "Add a candidate to your talent database."}
          </DialogDescription>
        </DialogHeader>

        <CandidateForm
          candidate={candidate}
          submitting={submitting}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}