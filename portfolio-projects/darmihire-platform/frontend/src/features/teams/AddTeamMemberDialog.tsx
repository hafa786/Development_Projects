import {
  useMemo,
  useState,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Loader2,
  Search,
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
import { Input } from "@/components/ui/input";

import {
  getMembers,
} from "@/features/members/api";
import {
  memberQueryKeys,
} from "@/features/members/queryKeys";

import {
  addTeamMember,
  getTeamMembers,
} from "@/features/teams/api";
import {
  teamQueryKeys,
} from "@/features/teams/queryKeys";

import type {
  Member,
} from "@/features/members/types";
import type {
  Team,
} from "@/features/teams/types";

import {
  getTenantId,
} from "@/utils/session";

type AddTeamMemberDialogProps = {
  open: boolean;
  team: Team | null;
  onOpenChange: (open: boolean) => void;
};

export function AddTeamMemberDialog({
  open,
  team,
  onOpenChange,
}: AddTeamMemberDialogProps) {
  const tenantId = getTenantId();

  const queryClient = useQueryClient();

  const [search, setSearch] =
    useState("");

  /*
   * Workspace members
   */

  const workspaceMembersQuery = useQuery({
    queryKey:
      memberQueryKeys.list(tenantId),

    queryFn: getMembers,

    enabled:
      Boolean(tenantId) && open,
  });

  /*
   * Existing team members
   */

  const teamMembersQuery = useQuery({
    queryKey:
      teamQueryKeys.members(
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

  /*
   * Add member
   */

  const addMutation = useMutation({
    mutationFn: (
      tenantUserId: string,
    ) => {
      if (!team) {
        throw new Error(
          "Team is required.",
        );
      }

      return addTeamMember(
        team.id,
        {
          tenantUserId,
        },
      );
    },

    onSuccess: async () => {
      if (!team || !tenantId) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey:
          teamQueryKeys.members(
            tenantId,
            team.id,
          ),
      });

      toast.success(
        "Member added to team.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Unable to add member to team.",
      );
    },
  });

  /*
   * Remove members that already belong
   * to this team.
   */

  const availableMembers =
    useMemo(() => {
      const workspaceMembers =
        workspaceMembersQuery.data ?? [];

      const teamMembers =
        teamMembersQuery.data ?? [];

      const existingIds = new Set(
        teamMembers.map(
          (member) =>
            member.tenantUserId,
        ),
      );

      const value =
        search
          .trim()
          .toLowerCase();

      return workspaceMembers.filter(
        (member) => {
          /*
           * Only ACTIVE workspace members
           * can be added.
           */

          if (
            member.status !== "ACTIVE"
          ) {
            return false;
          }

          /*
           * Already belongs to team.
           */

          if (
            existingIds.has(
              member.tenantUserId,
            )
          ) {
            return false;
          }

          if (!value) {
            return true;
          }

          const fullName =
            `${member.firstName} ${member.lastName}`
              .trim()
              .toLowerCase();

          return (
            fullName.includes(value) ||
            member.email
              .toLowerCase()
              .includes(value)
          );
        },
      );
    }, [
      workspaceMembersQuery.data,
      teamMembersQuery.data,
      search,
    ]);

  const loading =
    workspaceMembersQuery.isLoading ||
    teamMembersQuery.isLoading;

  const error =
    workspaceMembersQuery.isError ||
    teamMembersQuery.isError;

  function handleOpenChange(
    nextOpen: boolean,
  ) {
    if (!nextOpen) {
      setSearch("");
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={
        handleOpenChange
      }
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Add team member
          </DialogTitle>

          <DialogDescription>
            {team
              ? `Add an existing workspace member to ${team.name}.`
              : "Add a workspace member to this team."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              placeholder="Search workspace members..."
              className="pl-9"
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
              <p className="font-medium">
                Unable to load workspace
                members
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Try again in a moment.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            availableMembers.length ===
              0 && (
              <div className="rounded-lg border border-dashed p-10 text-center">
                <Users className="mx-auto size-8 text-muted-foreground" />

                <p className="mt-3 font-medium">
                  {search
                    ? "No members found"
                    : "No members available"}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {search
                    ? "Try another search."
                    : "All active workspace members may already belong to this team."}
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            availableMembers.length >
              0 && (
              <div className="max-h-[400px] divide-y overflow-y-auto rounded-lg border">
                {availableMembers.map(
                  (member) => (
                    <WorkspaceMemberRow
                      key={
                        member.tenantUserId
                      }
                      member={member}
                      adding={
                        addMutation.isPending
                      }
                      onAdd={() =>
                        addMutation.mutate(
                          member.tenantUserId,
                        )
                      }
                    />
                  ),
                )}
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

type WorkspaceMemberRowProps = {
  member: Member;
  adding: boolean;
  onAdd: () => void;
};

function WorkspaceMemberRow({
  member,
  adding,
  onAdd,
}: WorkspaceMemberRowProps) {
  const fullName = [
    member.firstName,
    member.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {member.firstName
            ?.charAt(0)
            .toUpperCase()}

          {member.lastName
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium">
            {fullName ||
              member.email}
          </p>

          <p className="truncate text-sm text-muted-foreground">
            {member.email}
          </p>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={adding}
        onClick={onAdd}
      >
        {adding ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <UserPlus className="mr-2 size-4" />
        )}

        Add
      </Button>
    </div>
  );
}