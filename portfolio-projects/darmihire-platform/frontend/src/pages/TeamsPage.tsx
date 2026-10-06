import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    MoreHorizontal,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
    UserRoundCog,
    Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    createTeam,
    deleteTeam,
    getTeams,
    updateTeam,
} from "@/features/teams/api";
import {
    AddTeamMemberDialog,
} from "@/features/teams/AddTeamMemberDialog";

import { DeleteTeamDialog } from "@/features/teams/DeleteTeamDialog";
import { ManageTeamMembersDialog } from "@/features/teams/ManageTeamMembersDialog";
import { teamQueryKeys } from "@/features/teams/queryKeys";
import type { TeamFormData } from "@/features/teams/schemas";
import { TeamDialog } from "@/features/teams/TeamDialog";
import type { Team } from "@/features/teams/types";
import { getTenantId } from "@/utils/session";

export default function TeamsPage() {
    const queryClient = useQueryClient();

    const tenantId = getTenantId();

    /*
     * ---------------------------------------------------------
     * STATE
     * ---------------------------------------------------------
     */

    const [teamDialogOpen, setTeamDialogOpen] = useState(false);

    const [membersDialogOpen, setMembersDialogOpen] = useState(false);
    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    /*
     * ---------------------------------------------------------
     * QUERY
     * ---------------------------------------------------------
     */

    const teamsQuery = useQuery({
        queryKey: teamQueryKeys.list(tenantId!),
        queryFn: getTeams,
        enabled: Boolean(tenantId),
    });

    /*
     * ---------------------------------------------------------
     * CREATE TEAM
     * ---------------------------------------------------------
     */

    const createMutation = useMutation({
        mutationFn: createTeam,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: teamQueryKeys.list(tenantId!),
            });

            setTeamDialogOpen(false);

            setSelectedTeam(null);

            toast.success("Team created.");
        },

        onError: (error: Error) => {
            toast.error(error.message || "Unable to create team.");
        },
    });

    /*
     * ---------------------------------------------------------
     * UPDATE TEAM
     * ---------------------------------------------------------
     */

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: TeamFormData }) =>
            updateTeam(id, {
                name: data.name,
                description: data.description || null,
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: teamQueryKeys.list(tenantId!),
            });

            setTeamDialogOpen(false);

            setSelectedTeam(null);

            toast.success("Team updated.");
        },

        onError: (error: Error) => {
            toast.error(error.message || "Unable to update team.");
        },
    });

    /*
     * ---------------------------------------------------------
     * DELETE TEAM
     * ---------------------------------------------------------
     */

    const deleteMutation = useMutation({
        mutationFn: deleteTeam,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: teamQueryKeys.list(tenantId!),
            });

            setDeleteDialogOpen(false);

            setSelectedTeam(null);

            toast.success("Team deleted.");
        },

        onError: (error: Error) => {
            toast.error(error.message || "Unable to delete team.");
        },
    });

    /*
     * ---------------------------------------------------------
     * DIALOG HANDLERS
     * ---------------------------------------------------------
     */

    function openCreateDialog() {
        setSelectedTeam(null);

        setTeamDialogOpen(true);
    }

    function openEditDialog(team: Team) {
        setSelectedTeam(team);

        setTeamDialogOpen(true);
    }

    function openMembersDialog(team: Team) {
        setSelectedTeam(team);

        setMembersDialogOpen(true);
    }

    function openDeleteDialog(team: Team) {
        setSelectedTeam(team);

        setDeleteDialogOpen(true);
    }

    /*
     * ---------------------------------------------------------
     * SUBMIT TEAM
     * ---------------------------------------------------------
     */

    function handleTeamSubmit(data: TeamFormData) {
        if (selectedTeam) {
            updateMutation.mutate({
                id: selectedTeam.id,
                data,
            });

            return;
        }

        createMutation.mutate({
            name: data.name,
            description: data.description || null,
        });
    }

    /*
     * ---------------------------------------------------------
     * DELETE TEAM
     * ---------------------------------------------------------
     */

    function handleDelete() {
        if (!selectedTeam) {
            return;
        }

        deleteMutation.mutate(selectedTeam.id);
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;

    /*
     * ---------------------------------------------------------
     * RENDER
     * ---------------------------------------------------------
     */

    return (
        <>
            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                <PageHeader
                    title="Teams"
                    description="Create teams and manage their members across your organization."
                    actions={
                        <Button type="button" onClick={openCreateDialog}>
                            <Plus />
                            Add team
                        </Button>
                    }
                />

                {/* Loading */}

                {teamsQuery.isLoading && <TeamTableSkeleton />}

                {/* Error */}

                {teamsQuery.isError && (
                    <div className="rounded-xl border bg-background p-8 text-center">
                        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10">
                            <Users className="size-5 text-destructive" />
                        </div>

                        <h2 className="mt-4 font-semibold">Unable to load teams</h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Something went wrong while loading your teams.
                        </p>

                        <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={() => teamsQuery.refetch()}
                        >
                            <RefreshCw />
                            Try again
                        </Button>
                    </div>
                )}

                {/* Empty state */}

                {teamsQuery.isSuccess && teamsQuery.data.length === 0 && (
                    <EmptyState
                        icon={Users}
                        title="No teams yet"
                        description="Create teams such as Platform, Backend, Product, or Recruitment."
                    />
                )}

                {/* Team table */}

                {teamsQuery.isSuccess && teamsQuery.data.length > 0 && (
                    <div className="overflow-hidden rounded-xl border bg-background">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Team</TableHead>

                                    <TableHead>Description</TableHead>

                                    <TableHead className="w-16">
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {teamsQuery.data.map((team) => (
                                    <TableRow key={team.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <Users className="size-4" />
                                                </div>

                                                <span className="font-medium">{team.name}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="max-w-md text-muted-foreground">
                                            {team.description || "—"}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <TeamActions
                                                team={team}
                                                onEdit={openEditDialog}
                                                onManageMembers={openMembersDialog}
                                                onDelete={openDeleteDialog}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Create / Edit Team */}

            <TeamDialog
                open={teamDialogOpen}
                team={selectedTeam}
                isSubmitting={isSaving}
                onOpenChange={(open) => {
                    setTeamDialogOpen(open);

                    if (!open) {
                        setSelectedTeam(null);
                    }
                }}
                onSubmit={handleTeamSubmit}
            />

            {/* Manage Team Members */}

            <ManageTeamMembersDialog
                open={membersDialogOpen}
                team={selectedTeam}
                onOpenChange={(open) => {
                    setMembersDialogOpen(open);

                    if (!open) {
                        setSelectedTeam(null);
                    }
                }}
                onAddMember={() => {
                    setAddMemberDialogOpen(true);
                }}
            />

            <AddTeamMemberDialog
                open={addMemberDialogOpen}
                team={selectedTeam}
                onOpenChange={
                    setAddMemberDialogOpen
                }
            />

            {/* Delete Team */}

            <DeleteTeamDialog
                open={deleteDialogOpen}
                team={selectedTeam}
                isDeleting={deleteMutation.isPending}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);

                    if (!open) {
                        setSelectedTeam(null);
                    }
                }}
                onConfirm={handleDelete}
            />
        </>
    );
}

/*
 * ---------------------------------------------------------
 * TEAM ACTIONS
 * ---------------------------------------------------------
 */

type TeamActionsProps = {
    team: Team;

    onEdit: (team: Team) => void;

    onManageMembers: (team: Team) => void;

    onDelete: (team: Team) => void;
};

function TeamActions({
    team,
    onEdit,
    onManageMembers,
    onDelete,
}: TeamActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Actions for ${team.name}`}
            >
                <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                {/* Edit */}

                <DropdownMenuItem onSelect={() => onEdit(team)} onClick={() => onEdit(team)}>
                    <Pencil />
                    Edit
                </DropdownMenuItem>

                {/* Manage Members */}

                <DropdownMenuItem onSelect={() => onManageMembers(team)} onClick={() => onManageMembers(team)}>
                    <UserRoundCog />
                    Manage members
                </DropdownMenuItem>

                {/* Delete */}

                <DropdownMenuItem variant="destructive" onSelect={() => onDelete(team)} onClick={() => onDelete(team)}>
                    <Trash2 />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/*
 * ---------------------------------------------------------
 * TABLE SKELETON
 * ---------------------------------------------------------
 */

function TeamTableSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border bg-background">
            <div className="space-y-1 p-4">
                {Array.from({
                    length: 4,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 border-b py-4 last:border-b-0"
                    >
                        <Skeleton className="size-9 rounded-lg" />

                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-40" />

                            <Skeleton className="h-3 w-72 max-w-full" />
                        </div>

                        <Skeleton className="size-8" />
                    </div>
                ))}
            </div>
        </div>
    );
}
