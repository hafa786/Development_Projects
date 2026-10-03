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
import type { Location } from "@/features/locations/types";

type DeleteLocationDialogProps = {
  open: boolean;
  location: Location | null;
  isDeleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeleteLocationDialog({
  open,
  location,
  isDeleting = false,
  onOpenChange,
  onConfirm,
}: DeleteLocationDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-5 text-destructive" />
          </div>

          <DialogTitle>
            Delete location?
          </DialogTitle>

          <DialogDescription>
            {location
              ? `This will permanently delete "${location.name}". This action cannot be undone.`
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
            disabled={isDeleting || !location}
            onClick={onConfirm}
          >
            {isDeleting
              ? "Deleting..."
              : "Delete location"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}