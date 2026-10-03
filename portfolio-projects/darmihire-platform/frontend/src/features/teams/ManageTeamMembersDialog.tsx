import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Loader2,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getTeamMembers,
  removeTeamMember,
} from "@/features/teams/api";
import { teamQueryKeys } from "@/features/teams/queryKeys";
import type {
  Team,
  TeamMember,
} from "@/features/teams/types";
import { getTenantId } from "@/utils/session";

type ManageTeamMembersDialogProps = {
  open: boolean;
  team: Team | null;
  onOpenChange: (open: boolean) => void;
  onAddMember: () => void;
};

export function ManageTeamMembersDialog({
  open,
  team,
  onOpenChange,
  onAddMember,
}: ManageTeamMembersDialogProps) {
  const queryClient = useQueryClient();

  const tenantId = getTenantId();

  const membersQuery = useQuery({
    queryKey: teamQueryKeys.members(
      tenantId!,
      team?.id ?? "",
    ),

    queryFn: () =>
      getTeamMembers(team!.id),

    enabled:
      Boolean(tenantId) &&
      Boolean(team?.id) &&
      open,
  });

  const removeMutation = useMutation({
    mutationFn: (
      tenantUserId: string,
    ) =>
      removeTeamMember(
        team!.id,
        tenantUserId,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamQueryKeys.members(
          tenantId!,
          team!.id,
        ),
      });

      toast.success(
        "Member removed from team.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Unable to remove member.",
      );
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Manage team members
          </DialogTitle>

          <DialogDescription>
            {team
              ? `Manage members of ${team.name}.`
              : "Manage team members."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={onAddMember}
          >
            <UserPlus />
            Add member
          </Button>
        </div>

        {membersQuery.isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {membersQuery.isError && (
          <div className="rounded-lg border p-6 text-center">
            <p className="font-medium">
              Unable to load team members
            </p>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() =>
                membersQuery.refetch()
              }
            >
              Try again
            </Button>
          </div>
        )}

        {membersQuery.isSuccess &&
          membersQuery.data.length === 0 && (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <Users className="mx-auto size-8 text-muted-foreground" />

              <p className="mt-3 font-medium">
                No team members
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add workspace members to this team.
              </p>
            </div>
          )}

        {membersQuery.isSuccess &&
          membersQuery.data.length > 0 && (
            <div className="divide-y rounded-lg border">
              {membersQuery.data.map(
                (member) => (
                  <MemberRow
                    key={member.tenantUserId}
                    member={member}
                    removing={
                      removeMutation.isPending
                    }
                    onRemove={() =>
                      removeMutation.mutate(
                        member.tenantUserId,
                      )
                    }
                  />
                ),
              )}
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}

type MemberRowProps = {
  member: TeamMember;
  removing: boolean;
  onRemove: () => void;
};

function MemberRow({
  member,
  removing,
  onRemove,
}: MemberRowProps) {
  const fullName = [
    member.firstName,
    member.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="min-w-0">
        <p className="truncate font-medium">
          {fullName || member.email}
        </p>

        <p className="truncate text-sm text-muted-foreground">
          {member.email}
        </p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={removing}
        onClick={onRemove}
        aria-label={`Remove ${fullName || member.email}`}
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </div>
  );
}