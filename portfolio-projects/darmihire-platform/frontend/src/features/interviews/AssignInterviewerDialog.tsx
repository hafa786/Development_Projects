import { useMemo, useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Search,
  UserPlus,
  Users,
} from "lucide-react";

import { toast } from "sonner";

import { apiRequest } from "@/api/client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { getTenantId } from "@/utils/session";

import { addInterviewer } from "./api";

import { interviewQueryKeys } from "./queryKeys";

import type { Interview } from "./types";

/**
 * Minimal member model required by this dialog.
 *
 * IMPORTANT:
 * `id` must represent the TenantUser ID because the interview
 * backend expects:
 *
 * {
 *   "interviewerId": "<TenantUser UUID>"
 * }
 *
 * The optional fields make this component tolerant of slightly
 * different member response structures.
 */
type WorkspaceMember = {
  id: string;

  tenantUserId?: string | null;

  firstName?: string | null;
  lastName?: string | null;

  name?: string | null;
  fullName?: string | null;

  email?: string | null;

  status?: string | null;
};

type AssignInterviewerDialogProps = {
  interview: Interview;

  open: boolean;

  onOpenChange: (open: boolean) => void;
};

/**
 * Load workspace members directly through the shared API client.
 *
 * If your actual members endpoint is different, for example:
 *
 * /tenant-users
 * /workspace/members
 *
 * change ONLY the URL below.
 */
function getWorkspaceMembers() {
  return apiRequest<WorkspaceMember[]>(
    "/members",
    {
      method: "GET",
      authenticated: true,
      tenantScoped: true,
    },
  );
}

/**
 * Returns the TenantUser ID that must be sent to
 * the Interview API.
 */
function getMemberId(
  member: WorkspaceMember,
): string {
  return member.tenantUserId || member.id;
}

/**
 * Handles several possible member DTO structures.
 */
function getMemberName(
  member: WorkspaceMember,
): string {
  if (
    member.fullName &&
    member.fullName.trim()
  ) {
    return member.fullName.trim();
  }

  if (
    member.name &&
    member.name.trim()
  ) {
    return member.name.trim();
  }

  const composedName = [
    member.firstName,
    member.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (composedName) {
    return composedName;
  }

  if (member.email) {
    return member.email;
  }

  return "Workspace member";
}

export function AssignInterviewerDialog({
  interview,
  open,
  onOpenChange,
}: AssignInterviewerDialogProps) {
  const tenantId = getTenantId();

  const queryClient =
    useQueryClient();

  const [search, setSearch] =
    useState("");

  /*
   * Load workspace members only while
   * the dialog is open.
   */
  const membersQuery = useQuery({
    queryKey: [
      "workspace-members",
      tenantId,
    ],

    queryFn: getWorkspaceMembers,

    enabled: Boolean(
      tenantId && open,
    ),
  });

  /*
   * Assign interviewer mutation.
   */
  const addMutation = useMutation({
    mutationFn: (
      interviewerId: string,
    ) =>
      addInterviewer(
        interview.id,
        {
          interviewerId,
        },
      ),

    onSuccess: async () => {
      /*
       * Refresh all places where the
       * updated interview may appear.
       */
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            interviewQueryKeys.application(
              tenantId,
              interview.applicationId,
            ),
        }),

        queryClient.invalidateQueries({
          queryKey:
            interviewQueryKeys.detail(
              tenantId,
              interview.id,
            ),
        }),

        queryClient.invalidateQueries({
          queryKey:
            interviewQueryKeys.list(
              tenantId,
            ),
        }),
      ]);

      toast.success(
        "Interviewer assigned",
      );

      setSearch("");

      onOpenChange(false);
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to assign interviewer",
      );
    },
  });

  /*
   * TenantUser IDs already assigned
   * to this interview.
   */
  const assignedInterviewerIds =
    useMemo(() => {
      return new Set(
        interview.interviewers.map(
          (interviewer) =>
            interviewer.tenantUserId,
        ),
      );
    }, [interview.interviewers]);

  /*
   * Remove already assigned members
   * and apply the search filter.
   */
  const availableMembers =
    useMemo(() => {
      const members =
        membersQuery.data ?? [];

      const query = search
        .trim()
        .toLowerCase();

      return members.filter(
        (member) => {
          const memberId =
            getMemberId(member);

          /*
           * Do not show members who are
           * already assigned.
           */
          if (
            assignedInterviewerIds.has(
              memberId,
            )
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          const name =
            getMemberName(member)
              .toLowerCase();

          const email =
            member.email
              ?.toLowerCase()
              .trim() ?? "";

          return (
            name.includes(query) ||
            email.includes(query)
          );
        },
      );
    }, [
      membersQuery.data,
      assignedInterviewerIds,
      search,
    ]);

  const handleOpenChange = (
    value: boolean,
  ) => {
    /*
     * Prevent closing while an assignment
     * request is running.
     */
    if (addMutation.isPending) {
      return;
    }

    if (!value) {
      setSearch("");
    }

    onOpenChange(value);
  };

  const handleAdd = (
    member: WorkspaceMember,
  ) => {
    const interviewerId =
      getMemberId(member);

    if (!interviewerId) {
      toast.error(
        "Unable to determine the workspace member ID",
      );

      return;
    }

    addMutation.mutate(
      interviewerId,
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={
        handleOpenChange
      }
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Add interviewer
          </DialogTitle>

          <DialogDescription>
            Assign a workspace member to{" "}
            <span className="font-medium">
              {interview.title}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search by name or email..."
              className="pl-9"
              disabled={
                addMutation.isPending
              }
            />
          </div>

          {/* Loading */}
          {membersQuery.isLoading ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Loading workspace members...
              </p>
            </div>
          ) : null}

          {/* Error */}
          {membersQuery.isError ? (
            <div className="rounded-lg border border-destructive/50 p-4">
              <p className="text-sm font-medium">
                Unable to load workspace
                members
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Check the workspace member
                endpoint and try again.
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() =>
                  membersQuery.refetch()
                }
              >
                Try again
              </Button>
            </div>
          ) : null}

          {/* Empty */}
          {!membersQuery.isLoading &&
          !membersQuery.isError &&
          availableMembers.length ===
            0 ? (
            <div className="rounded-lg border border-dashed px-6 py-10 text-center">
              <Users className="mx-auto size-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                {search
                  ? "No matching members"
                  : "No available members"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {search
                  ? "Try searching with a different name or email."
                  : "All workspace members may already be assigned to this interview."}
              </p>
            </div>
          ) : null}

          {/* Members */}
          {!membersQuery.isLoading &&
          !membersQuery.isError &&
          availableMembers.length >
            0 ? (
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {availableMembers.map(
                (member) => {
                  const memberId =
                    getMemberId(
                      member,
                    );

                  const memberName =
                    getMemberName(
                      member,
                    );

                  return (
                    <div
                      key={memberId}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {/* Avatar */}
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {memberName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        {/* Member info */}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {
                              memberName
                            }
                          </p>

                          {member.email ? (
                            <p className="truncate text-xs text-muted-foreground">
                              {
                                member.email
                              }
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={
                          addMutation.isPending
                        }
                        onClick={() =>
                          handleAdd(
                            member,
                          )
                        }
                      >
                        <UserPlus className="mr-2 size-4" />

                        {addMutation.isPending
                          ? "Adding..."
                          : "Add"}
                      </Button>
                    </div>
                  );
                },
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}