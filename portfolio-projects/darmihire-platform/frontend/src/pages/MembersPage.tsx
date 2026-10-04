import {
    MoreHorizontal,
    RefreshCw,
    Search,
    Shield,
    UserCheck,
    UserRoundCog,
    UserX,
    Users,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";

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
    ChangeMemberRoleDialog,
} from "@/features/members/ChangeMemberRoleDialog";

import {
    ChangeMemberStatusDialog,
} from "@/features/members/ChangeMemberStatusDialog";

import {
    RemoveMemberDialog,
} from "@/features/members/RemoveMemberDialog";

import {
    getMembers,
    removeMember,
    updateMemberRole,
    updateMemberStatus,
} from "@/features/members/api";

import {
    memberQueryKeys,
} from "@/features/members/queryKeys";

import type {
    Member,
    MembershipStatus,
    MemberRole,
} from "@/features/members/types";

import { getTenantId } from "@/utils/session";

function roleLabel(role: MemberRole) {
    switch (role) {
        case "COMPANY_ADMIN":
            return "Company Admin";

        case "HIRING_MANAGER":
            return "Hiring Manager";

        case "RECRUITER":
            return "Recruiter";

        case "INTERVIEWER":
            return "Interviewer";

        case "VIEWER":
            return "Viewer";
    }
}

function initials(member: Member) {
    return `${member.firstName?.[0] ?? ""}${member.lastName?.[0] ?? ""
        }`.toUpperCase();
}

export default function MembersPage() {
    const queryClient = useQueryClient();

    const tenantId = getTenantId();

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

    /*
     * -------------------------------------------------------
     * QUERY
     * -------------------------------------------------------
     */

    const membersQuery = useQuery({
        queryKey:
            memberQueryKeys.list(tenantId),

        queryFn: getMembers,

        enabled: Boolean(tenantId),
    });

    /*
     * -------------------------------------------------------
     * ROLE
     * -------------------------------------------------------
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
                role,
            ),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    memberQueryKeys.list(
                        tenantId,
                    ),
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

    /*
     * -------------------------------------------------------
     * STATUS
     * -------------------------------------------------------
     */

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
                status,
            ),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    memberQueryKeys.list(
                        tenantId,
                    ),
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

    /*
     * -------------------------------------------------------
     * REMOVE
     * -------------------------------------------------------
     */

    const removeMutation = useMutation({
        mutationFn: removeMember,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    memberQueryKeys.list(
                        tenantId,
                    ),
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
     * -------------------------------------------------------
     * SEARCH
     * -------------------------------------------------------
     */

    const filteredMembers =
        useMemo(() => {
            const members =
                membersQuery.data ?? [];

            const value =
                search.trim().toLowerCase();

            if (!value) {
                return members;
            }

            return members.filter(
                (member) => {
                    const fullName =
                        `${member.firstName} ${member.lastName}`
                            .toLowerCase();

                    return (
                        fullName.includes(value) ||
                        member.email
                            .toLowerCase()
                            .includes(value) ||
                        roleLabel(member.role)
                            .toLowerCase()
                            .includes(value)
                    );
                },
            );
        }, [
            membersQuery.data,
            search,
        ]);

    /*
     * -------------------------------------------------------
     * LOADING
     * -------------------------------------------------------
     */

    if (membersQuery.isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Workspace members"
                    description="Manage people and access to your workspace."
                />

                <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
                    Loading workspace members...
                </div>
            </div>
        );
    }

    /*
     * -------------------------------------------------------
     * ERROR
     * -------------------------------------------------------
     */

    if (membersQuery.isError) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Workspace members"
                    description="Manage people and access to your workspace."
                />

                <div className="rounded-lg border p-10 text-center">
                    <p className="text-sm text-muted-foreground">
                        Unable to load workspace
                        members.
                    </p>

                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() =>
                            membersQuery.refetch()
                        }
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />

                        Try again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}

                <PageHeader
                    title="Workspace members"
                    description="Manage workspace members, roles and access."
                />

                {/* Search */}

                <div className="flex items-center justify-between gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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

                    <div className="text-sm text-muted-foreground">
                        {filteredMembers.length}{" "}
                        {filteredMembers.length === 1
                            ? "member"
                            : "members"}
                    </div>
                </div>

                {/* Empty workspace */}

                {membersQuery.data?.length ===
                    0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <Users className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <h3 className="font-semibold">
                            No workspace members
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Members added to this
                            workspace will appear here.
                        </p>
                    </div>
                ) : filteredMembers.length ===
                    0 ? (
                    <div className="rounded-lg border border-dashed px-6 py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            No members match "
                            {search}".
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-lg border">
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
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback>
                                                            {initials(
                                                                member,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div>
                                                        <div className="font-medium">
                                                            {
                                                                member.firstName
                                                            }{" "}
                                                            {
                                                                member.lastName
                                                            }
                                                        </div>

                                                        <div className="text-sm text-muted-foreground">
                                                            {
                                                                member.email
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="secondary">
                                                    <Shield className="mr-1 h-3 w-3" />

                                                    {roleLabel(
                                                        member.role,
                                                    )}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                {member.status ===
                                                    "ACTIVE" ? (
                                                    <Badge>
                                                        Active
                                                    </Badge>
                                                ) : member.status ===
                                                    "INVITED" ? (
                                                    <Badge variant="outline">
                                                        Invited
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">
                                                        Suspended
                                                    </Badge>
                                                )}
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
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align="end"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedMember(
                                                                    member,
                                                                );

                                                                setRoleDialogOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <UserRoundCog className="mr-2 h-4 w-4" />

                                                            Change role
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedMember(
                                                                    member,
                                                                );

                                                                setStatusDialogOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            {member.status ===
                                                                "SUSPENDED" ? (
                                                                <>
                                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                                    Activate
                                                                    member
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserX className="mr-2 h-4 w-4" />
                                                                    Suspend
                                                                    member
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => {
                                                                setSelectedMember(
                                                                    member,
                                                                );

                                                                setRemoveDialogOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <UserX className="mr-2 h-4 w-4" />

                                                            Remove member
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
            </div>

            {/* Role dialog */}

            <ChangeMemberRoleDialog
                member={selectedMember}
                open={roleDialogOpen}
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

            {/* Status dialog */}

            <ChangeMemberStatusDialog
                member={selectedMember}
                open={statusDialogOpen}
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

            {/* Remove dialog */}

            <RemoveMemberDialog
                member={selectedMember}
                open={removeDialogOpen}
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
        </>
    );
}