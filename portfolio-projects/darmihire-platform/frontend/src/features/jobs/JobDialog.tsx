import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { JobForm } from "./JobForm";
import type { JobFormValues } from "./schemas";
import type { Job } from "./types";

type JobDialogProps = {
  open: boolean;
  job?: Job | null;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: JobFormValues) => void;
};

export function JobDialog({
  open,
  job,
  submitting,
  onOpenChange,
  onSubmit,
}: JobDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {job
              ? "Edit job"
              : "Create job"}
          </DialogTitle>

          <DialogDescription>
            {job
              ? "Update the job requisition details."
              : "Create a new job requisition for your workspace."}
          </DialogDescription>
        </DialogHeader>

        <JobForm
          key={job?.id ?? "new-job"}
          job={job}
          submitting={submitting}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}