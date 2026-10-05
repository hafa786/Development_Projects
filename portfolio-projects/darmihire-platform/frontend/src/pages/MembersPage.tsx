import {
  MoreHorizontal,
  Search,
  Shield,
  UserCheck,
  UserRound,
  UserX,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getMembers,
  removeMember,
  updateMemberRole,
  updateMemberStatus,
} from "@/features/members/api";

import { memberQueryKeys } from "@/features/members/queryKeys";

import {
  ChangeMemberRoleDialog,
} from "@/features/members/ChangeMemberRoleDialog";

import {
  ChangeMemberStatusDialog,
} from "@/features/members/ChangeMemberStatusDialog";

import {
  RemoveMemberDialog,
} from "@/features/members/RemoveMemberDialog";

import type {
  Member,
  MemberRole,
  MembershipStatus,
} from "@/features/members/types";

import { getTenantId } from "@/utils/session";

function roleLabel(role: MemberRole) {
  switch (role) {
    case "COMPANY_ADMIN":
      return "Company admin";

    case "RECRUITER":
      return "Recruiter";

    case "HIRING_MANAGER":
      return "Hiring manager";

    case "INTERVIEWER":
      return "Interviewer";

    case "VIEWER":
      return "Viewer";
  }
}

function statusLabel(
  status: MembershipStatus,
) {
  switch (status) {
    case "ACTIVE":
      return "Active";

    case "INVITED":
      return "Invited";

    case "SUSPENDED":
      return "Suspended";
  }
}

function initials(member: Member) {
  const first =
    member.firstName?.charAt(0) ?? "";

  const last =
    member.lastName?.charAt(0) ?? "";

  return `${first}${last}`.toUpperCase();
}

export default function MembersPage() {
  const tenantId = getTenantId();

  const queryClient = useQueryClient();

  const [search, setSearch] =
    useState("");

  const [
    selectedMember,
    setSelectedMember,
  ] = useState<Member | null>(null);

  const [
    roleDialogOpen,
    setRoleDialogOpen,
  ] = useState(false);

  const [
    statusDialogOpen,
    setStatusDialogOpen,
  ] = useState(false);

  const [
    removeDialogOpen,
    setRemoveDialogOpen,
  ] = useState(false);

  const membersQuery = useQuery({
    queryKey:
      memberQueryKeys.list(tenantId),

    queryFn: getMembers,

    enabled: Boolean(tenantId),
  });

  const roleMutation = useMutation({
    mutationFn: ({
      tenantUserId,
      role,
    }: {
      tenantUserId: string;
      role: MemberRole;
    }) =>
      updateMemberRole(
        tenantUserId,
        { role },
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          memberQueryKeys.list(tenantId),
      });

      setRoleDialogOpen(false);
      setSelectedMember(null);

      toast.success(
        "Member role updated.",
      );
    },

    onError: () => {
      toast.error(
        "Unable to update member role.",
      );
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      tenantUserId,
      status,
    }: {
      tenantUserId: string;
      status: MembershipStatus;
    }) =>
      updateMemberStatus(
        tenantUserId,
        { status },
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          memberQueryKeys.list(tenantId),
      });

      setStatusDialogOpen(false);
      setSelectedMember(null);

      toast.success(
        "Member status updated.",
      );
    },

    onError: () => {
      toast.error(
        "Unable to update member status.",
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeMember,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          memberQueryKeys.list(tenantId),
      });

      setRemoveDialogOpen(false);
      setSelectedMember(null);

      toast.success(
        "Member removed from workspace.",
      );
    },

    onError: () => {
      toast.error(
        "Unable to remove member.",
      );
    },
  });

  const filteredMembers = useMemo(() => {
    const members =
      membersQuery.data ?? [];

    const value =
      search.trim().toLowerCase();

    if (!value) {
      return members;
    }

    return members.filter((member) => {
      const name =
        `${member.firstName} ${member.lastName}`
          .toLowerCase();

      return (
        name.includes(value) ||
        member.email
          .toLowerCase()
          .includes(value) ||
        roleLabel(member.role)
          .toLowerCase()
          .includes(value)
      );
    });
  }, [membersQuery.data, search]);

  function openRoleDialog(
    member: Member,
  ) {
    setSelectedMember(member);
    setRoleDialogOpen(true);
  }

  function openStatusDialog(
    member: Member,
  ) {
    setSelectedMember(member);
    setStatusDialogOpen(true);
  }

  function openRemoveDialog(
    member: Member,
  ) {
    setSelectedMember(member);
    setRemoveDialogOpen(true);
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Members"
        description="Manage people, roles and access to your DarmiHire workspace."
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search members..."
            className="pl-9"
          />
        </div>
      </div>

      {membersQuery.isLoading && (
        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          Loading members...
        </div>
      )}

      {membersQuery.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-medium">
            Unable to load members
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't load your workspace
            members.
          </p>

          <Button
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
        filteredMembers.length === 0 && (
          <div className="rounded-lg border p-12 text-center">
            <UserRound className="mx-auto size-10 text-muted-foreground" />

            <h3 className="mt-4 font-semibold">
              {search
                ? "No members found"
                : "No workspace members"}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Try another search."
                : "Workspace members will appear here."}
            </p>
          </div>
        )}

      {membersQuery.isSuccess &&
        filteredMembers.length > 0 && (
          <div className="overflow-hidden rounded-lg border bg-background">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Member
                  </TableHead>

                  <TableHead>
                    Role
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Joined
                  </TableHead>

                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredMembers.map(
                  (member) => (
                    <TableRow
                      key={
                        member.tenantUserId
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                            {initials(
                              member,
                            )}
                          </div>

                          <div>
                            <p className="font-medium">
                              {
                                member.firstName
                              }{" "}
                              {
                                member.lastName
                              }
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {
                                member.email
                              }
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="size-4 text-muted-foreground" />

                          {roleLabel(
                            member.role,
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium">
                          {statusLabel(
                            member.status,
                          )}
                        </span>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {member.joinedAt
                          ? new Date(
                              member.joinedAt,
                            ).toLocaleDateString()
                          : "—"}
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                openRoleDialog(
                                  member,
                                )
                              }
                            >
                              <Shield className="mr-2 size-4" />
                              Change role
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                openStatusDialog(
                                  member,
                                )
                              }
                            >
                              {member.status ===
                              "SUSPENDED" ? (
                                <UserCheck className="mr-2 size-4" />
                              ) : (
                                <UserX className="mr-2 size-4" />
                              )}

                              {member.status ===
                              "SUSPENDED"
                                ? "Activate"
                                : "Suspend"}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                openRemoveDialog(
                                  member,
                                )
                              }
                            >
                              <UserX className="mr-2 size-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        )}

      <ChangeMemberRoleDialog
        open={roleDialogOpen}
        member={selectedMember}
        loading={
          roleMutation.isPending
        }
        onOpenChange={
          setRoleDialogOpen
        }
        onConfirm={(role) => {
          if (!selectedMember) {
            return;
          }

          roleMutation.mutate({
            tenantUserId:
              selectedMember.tenantUserId,
            role,
          });
        }}
      />

      <ChangeMemberStatusDialog
        open={statusDialogOpen}
        member={selectedMember}
        loading={
          statusMutation.isPending
        }
        onOpenChange={
          setStatusDialogOpen
        }
        onConfirm={(status) => {
          if (!selectedMember) {
            return;
          }

          statusMutation.mutate({
            tenantUserId:
              selectedMember.tenantUserId,
            status,
          });
        }}
      />

      <RemoveMemberDialog
        open={removeDialogOpen}
        member={selectedMember}
        loading={
          removeMutation.isPending
        }
        onOpenChange={
          setRemoveDialogOpen
        }
        onConfirm={() => {
          if (!selectedMember) {
            return;
          }

          removeMutation.mutate(
            selectedMember.tenantUserId,
          );
        }}
      />
    </div>
  );
}