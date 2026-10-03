import { useMemo } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DepartmentForm } from "@/features/departments/DepartmentForm";
import type { DepartmentFormData } from "@/features/departments/schemas";
import type { Department } from "@/features/departments/types";

type DepartmentDialogProps = {
  open: boolean;

  department?: Department | null;

  isSubmitting?: boolean;

  onOpenChange: (open: boolean) => void;

  onSubmit: (data: DepartmentFormData) => void;
};

export function DepartmentDialog({
  open,
  department,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: DepartmentDialogProps) {
  const isEditing = Boolean(department);

  const defaultValues = useMemo<DepartmentFormData>(
    () => ({
      name: department?.name ?? "",

      description: department?.description ?? "",
    }),
    [department],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit department" : "Create department"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the department information."
              : "Add a department to your workspace."}
          </DialogDescription>
        </DialogHeader>

        <DepartmentForm
          defaultValues={defaultValues}
          submitLabel={isEditing ? "Save changes" : "Create department"}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
