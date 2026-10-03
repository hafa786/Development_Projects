import { useMemo } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamForm } from "@/features/teams/TeamForm";
import type { TeamFormData } from "@/features/teams/schemas";
import type { Team } from "@/features/teams/types";

type TeamDialogProps = {
  open: boolean;
  team?: Team | null;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TeamFormData) => void;
};

export function TeamDialog({
  open,
  team,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: TeamDialogProps) {
  const isEditing = Boolean(team);

  const defaultValues = useMemo<TeamFormData>(
    () => ({
      name: team?.name ?? "",
      description: team?.description ?? "",
    }),
    [team],
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
              ? "Edit team"
              : "Create team"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the team information."
              : "Add a team to your workspace."}
          </DialogDescription>
        </DialogHeader>

        <TeamForm
          defaultValues={defaultValues}
          submitLabel={
            isEditing
              ? "Save changes"
              : "Create team"
          }
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}