import {
    Mail,
    MoreHorizontal,
    Search,
    Shield,
    UserCheck,
    UserPlus,
    UserRound,
    UserX,
    XCircle,
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
    cancelInvitation,
    createInvitation,
    getInvitations,
    getMembers,
    removeMember,
    updateMemberRole,
    updateMemberStatus,
} from "@/features/members/api";

import {
    memberQueryKeys,
} from "@/features/members/queryKeys";

import {
    ChangeMemberRoleDialog,
} from "@/features/members/ChangeMemberRoleDialog";

import {
    ChangeMemberStatusDialog,
} from "@/features/members/ChangeMemberStatusDialog";

import {
    RemoveMemberDialog,
} from "@/features/members/RemoveMemberDialog";

import {
    InviteMemberDialog,
} from "@/features/members/InviteMemberDialog";

import {
    CancelInvitationDialog,
} from "@/features/members/CancelInvitationDialog";

import type {
    CreateInvitationRequest,
    Invitation,
    InvitationStatus,
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

function invitationStatusLabel(
    status: InvitationStatus,
) {
    switch (status) {
        case "PENDING":
            return "Pending";

        case "ACCEPTED":
            return "Accepted";

        case "CANCELLED":
            return "Cancelled";

        case "EXPIRED":
            return "Expired";
    }
}

function initials(member: Member) {
    const first =
        member.firstName?.charAt(0) ?? "";

    const last =
        member.lastName?.charAt(0) ?? "";

    return `${first}${last}`.toUpperCase();
}

function formatDate(
    value: string | null | undefined,
) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString();
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
        selectedInvitation,
        setSelectedInvitation,
    ] = useState<Invitation | null>(null);

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

    const [
        inviteDialogOpen,
        setInviteDialogOpen,
    ] = useState(false);

    const [
        cancelInvitationDialogOpen,
        setCancelInvitationDialogOpen,
    ] = useState(false);

    /*
     * ---------------------------------------------------------
     * QUERIES
     * ---------------------------------------------------------
     */

    const membersQuery = useQuery({
        queryKey:
            memberQueryKeys.list(tenantId),

        queryFn: getMembers,

        enabled: Boolean(tenantId),
    });

    const invitationsQuery = useQuery({
        queryKey:
            memberQueryKeys.invitationList(
                tenantId,
            ),

        queryFn: getInvitations,

        enabled: Boolean(tenantId),
    });

    /*
     * ---------------------------------------------------------
     * MEMBER MUTATIONS
     * ---------------------------------------------------------
     */

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

    /*
     * ---------------------------------------------------------
     * INVITATION MUTATIONS
     * ---------------------------------------------------------
     */

    const inviteMutation = useMutation({
        mutationFn: (
            request: CreateInvitationRequest,
        ) =>
            createInvitation(request),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    memberQueryKeys.invitationList(
                        tenantId,
                    ),
            });

            setInviteDialogOpen(false);

            toast.success(
                "Workspace invitation created.",
            );
        },

        onError: () => {
            toast.error(
                "Unable to create invitation.",
            );
        },
    });

    const cancelInvitationMutation =
        useMutation({
            mutationFn: cancelInvitation,

            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey:
                        memberQueryKeys.invitationList(
                            tenantId,
                        ),
                });

                setCancelInvitationDialogOpen(
                    false,
                );

                setSelectedInvitation(null);

                toast.success(
                    "Invitation cancelled.",
                );
            },

            onError: () => {
                toast.error(
                    "Unable to cancel invitation.",
                );
            },
        });

    /*
     * ---------------------------------------------------------
     * FILTER MEMBERS
     * ---------------------------------------------------------
     */

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

    /*
     * Only pending invitations need workspace
     * management actions on this page.
     */

    const pendingInvitations =
        useMemo(() => {
            return (
                invitationsQuery.data ?? []
            ).filter(
                (invitation) =>
                    invitation.status === "PENDING",
            );
        }, [invitationsQuery.data]);

    /*
     * ---------------------------------------------------------
     * DIALOG HELPERS
     * ---------------------------------------------------------
     */

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

    function openCancelInvitationDialog(
        invitation: Invitation,
    ) {
        setSelectedInvitation(invitation);

        setCancelInvitationDialogOpen(
            true,
        );
    }

    return (
        <div className="space-y-8 p-6">
            <PageHeader
                title="Members"
                description="Manage people, roles, invitations and access to your DarmiHire workspace."
            />

            {/* -----------------------------------------
          MEMBERS TOOLBAR
      ------------------------------------------ */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

                <Button
                    onClick={() =>
                        setInviteDialogOpen(true)
                    }
                >
                    <UserPlus className="mr-2 size-4" />
                    Invite member
                </Button>
            </div>

            {/* -----------------------------------------
          WORKSPACE MEMBERS
      ------------------------------------------ */}

            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        Workspace members
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        People who currently belong to
                        this workspace.
                    </p>
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
                                                    {formatDate(
                                                        member.joinedAt,
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
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
            </section>

            {/* -----------------------------------------
          PENDING INVITATIONS
      ------------------------------------------ */}

            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        Pending invitations
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Invitations waiting for people
                        to join your workspace.
                    </p>
                </div>

                {invitationsQuery.isLoading && (
                    <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
                        Loading invitations...
                    </div>
                )}

                {invitationsQuery.isError && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
                        <p className="font-medium">
                            Unable to load invitations
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            We couldn't load your workspace
                            invitations.
                        </p>

                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() =>
                                invitationsQuery.refetch()
                            }
                        >
                            Try again
                        </Button>
                    </div>
                )}

                {invitationsQuery.isSuccess &&
                    pendingInvitations.length ===
                    0 && (
                        <div className="rounded-lg border p-10 text-center">
                            <Mail className="mx-auto size-9 text-muted-foreground" />

                            <h3 className="mt-3 font-semibold">
                                No pending invitations
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Invite someone to join this
                                workspace.
                            </p>

                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() =>
                                    setInviteDialogOpen(true)
                                }
                            >
                                <UserPlus className="mr-2 size-4" />
                                Invite member
                            </Button>
                        </div>
                    )}

                {invitationsQuery.isSuccess &&
                    pendingInvitations.length >
                    0 && (
                        <div className="overflow-hidden rounded-lg border bg-background">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            Email
                                        </TableHead>

                                        <TableHead>
                                            Role
                                        </TableHead>

                                        <TableHead>
                                            Status
                                        </TableHead>

                                        <TableHead>
                                            Invited
                                        </TableHead>

                                        <TableHead>
                                            Expires
                                        </TableHead>

                                        <TableHead className="w-[70px]" />
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {pendingInvitations.map(
                                        (invitation) => (
                                            <TableRow
                                                key={
                                                    invitation.id
                                                }
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="size-4 text-muted-foreground" />

                                                        <span className="font-medium">
                                                            {
                                                                invitation.email
                                                            }
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    {roleLabel(
                                                        invitation.role,
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium">
                                                        {invitationStatusLabel(
                                                            invitation.status,
                                                        )}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="text-muted-foreground">
                                                    {formatDate(
                                                        invitation.createdAt,
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-muted-foreground">
                                                    {formatDate(
                                                        invitation.expiresAt,
                                                    )}
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
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() =>
                                                                    openCancelInvitationDialog(
                                                                        invitation,
                                                                    )
                                                                }
                                                            >
                                                                <XCircle className="mr-2 size-4" />
                                                                Cancel invitation
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
            </section>

            {/* -----------------------------------------
          MEMBER DIALOGS
      ------------------------------------------ */}

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

            {/* -----------------------------------------
          INVITATION DIALOGS
      ------------------------------------------ */}

            <InviteMemberDialog
                open={inviteDialogOpen}
                loading={
                    inviteMutation.isPending
                }
                onOpenChange={
                    setInviteDialogOpen
                }
                onConfirm={(request) =>
                    inviteMutation.mutate(
                        request,
                    )
                }
            />

            <CancelInvitationDialog
                open={
                    cancelInvitationDialogOpen
                }
                invitation={
                    selectedInvitation
                }
                loading={
                    cancelInvitationMutation.isPending
                }
                onOpenChange={
                    setCancelInvitationDialogOpen
                }
                onConfirm={() => {
                    if (!selectedInvitation) {
                        return;
                    }

                    cancelInvitationMutation.mutate(
                        selectedInvitation.id,
                    );
                }}
            />
        </div>
    );
}