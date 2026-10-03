import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Department } from "@/features/departments/types";

type DeleteDepartmentDialogProps = {
  open: boolean;

  department: Department | null;

  isDeleting?: boolean;

  onOpenChange: (open: boolean) => void;

  onConfirm: () => void;
};

export function DeleteDepartmentDialog({
  open,
  department,
  isDeleting = false,
  onOpenChange,
  onConfirm,
}: DeleteDepartmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </div>

          <DialogTitle>Delete department?</DialogTitle>

          <DialogDescription>
            {department
              ? `This will permanently delete "${department.name}". This action cannot be undone.`
              : "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting || !department}
            onClick={onConfirm}
          >
            {isDeleting ? "Deleting..." : "Delete department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
