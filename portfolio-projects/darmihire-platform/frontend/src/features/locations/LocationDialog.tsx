import { useMemo } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LocationForm } from "@/features/locations/LocationForm";
import type { LocationFormData } from "@/features/locations/schemas";
import type { Location } from "@/features/locations/types";

type LocationDialogProps = {
  open: boolean;
  location?: Location | null;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LocationFormData) => void;
};

export function LocationDialog({
  open,
  location,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: LocationDialogProps) {
  const isEditing = Boolean(location);

  const defaultValues = useMemo<LocationFormData>(
  () => ({
    name: location?.name ?? "",
    city: location?.city ?? "",
    country: location?.country ?? "",
    timezone: location?.timezone ?? "",
    remote: location?.remote ?? false,
  }),
  [location],
);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Edit location"
              : "Create location"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the location information."
              : "Add a hiring location to your workspace."}
          </DialogDescription>
        </DialogHeader>

        <LocationForm
          defaultValues={defaultValues}
          submitLabel={
            isEditing
              ? "Save changes"
              : "Create location"
          }
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}