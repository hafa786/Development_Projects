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

import {
  applicationQueryKeys,
} from "@/features/applications/queryKeys";

import { getTenantId } from "@/utils/session";

import { addInterviewer } from "./api";

import {
  interviewQueryKeys,
} from "./queryKeys";

import type {
  Interview,
} from "./types";

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

  onOpenChange: (
    open: boolean,
  ) => void;
};

function getWorkspaceMembers() {
  return apiRequest<
    WorkspaceMember[]
  >(
    "/members",
    {
      method: "GET",
      authenticated: true,
      tenantScoped: true,
    },
  );
}

function getMemberId(
  member: WorkspaceMember,
): string {
  return (
    member.tenantUserId ||
    member.id
  );
}

function getMemberName(
  member: WorkspaceMember,
): string {
  if (
    member.fullName?.trim()
  ) {
    return member.fullName.trim();
  }

  if (member.name?.trim()) {
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

  const membersQuery = useQuery({
    queryKey: [
      "workspace-members",
      tenantId,
    ],

    queryFn:
      getWorkspaceMembers,

    enabled: Boolean(
      tenantId && open,
    ),
  });

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

        queryClient.invalidateQueries({
          queryKey:
            applicationQueryKeys.activities(
              tenantId,
              interview.applicationId,
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

  const assignedInterviewerIds =
    useMemo(
      () =>
        new Set(
          interview.interviewers.map(
            (interviewer) =>
              interviewer.tenantUserId,
          ),
        ),
      [interview.interviewers],
    );

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
    if (
      addMutation.isPending
    ) {
      return;
    }

    if (!value) {
      setSearch("");
    }

    onOpenChange(value);
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

          {membersQuery.isLoading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading workspace members...
            </div>
          ) : null}

          {membersQuery.isError ? (
            <div className="rounded-lg border border-destructive/50 p-4">
              <p className="text-sm font-medium">
                Unable to load workspace
                members.
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
            </div>
          ) : null}

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

                      <Button
                        type="button"
                        size="sm"
                        disabled={
                          addMutation.isPending
                        }
                        onClick={() =>
                          addMutation.mutate(
                            memberId,
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