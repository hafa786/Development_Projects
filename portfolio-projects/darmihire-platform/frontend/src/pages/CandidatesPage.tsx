import { useMemo, useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import {
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  createCandidate,
  deleteCandidate,
  getCandidates,
  updateCandidate,
} from "@/features/candidates/api";

import { candidateQueryKeys } from "@/features/candidates/queryKeys";

import { CandidateDialog } from "@/features/candidates/CandidateDialog";

import { DeleteCandidateDialog } from "@/features/candidates/DeleteCandidateDialog";

import type {
  Candidate,
  CandidateSource,
} from "@/features/candidates/types";

import type { CandidateFormValues } from "@/features/candidates/schemas";

import { getTenantId } from "@/utils/session";

type SourceFilter = "ALL" | CandidateSource;

export default function CandidatesPage() {
  const navigate = useNavigate();

  const tenantId = getTenantId();

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [sourceFilter, setSourceFilter] =
    useState<SourceFilter>("ALL");

  const [candidateDialogOpen, setCandidateDialogOpen] =
    useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  const candidatesQuery = useQuery({
    queryKey: candidateQueryKeys.list(tenantId),
    queryFn: getCandidates,
    enabled: Boolean(tenantId),
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const candidates = candidatesQuery.data ?? [];

  const statistics = useMemo(() => {
    return {
      total: candidates.length,

      linkedin: candidates.filter(
        (candidate) =>
          candidate.source === "LINKEDIN",
      ).length,

      referrals: candidates.filter(
        (candidate) =>
          candidate.source === "REFERRAL",
      ).length,

      addedThisMonth: candidates.filter(
        (candidate) => {
          const created = new Date(candidate.createdAt);
          const now = new Date();

          return (
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear()
          );
        },
      ).length,
    };
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesSearch =
        !query ||
        candidate.fullName
          .toLowerCase()
          .includes(query) ||
        candidate.email
          .toLowerCase()
          .includes(query) ||
        candidate.location
          ?.toLowerCase()
          .includes(query);

      const matchesSource =
        sourceFilter === "ALL" ||
        candidate.source === sourceFilter;

      return matchesSearch && matchesSource;
    });
  }, [candidates, search, sourceFilter]);

  const invalidateCandidates = () =>
    queryClient.invalidateQueries({
      queryKey:
        candidateQueryKeys.list(tenantId),
    });

  const createMutation = useMutation({
    mutationFn: createCandidate,

    onSuccess: async () => {
      await invalidateCandidates();

      setCandidateDialogOpen(false);
      setSelectedCandidate(null);

      toast.success(
        "Candidate created successfully.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to create candidate.",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: Parameters<
        typeof updateCandidate
      >[1];
    }) => updateCandidate(id, request),

    onSuccess: async () => {
      await invalidateCandidates();

      setCandidateDialogOpen(false);
      setSelectedCandidate(null);

      toast.success(
        "Candidate updated successfully.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to update candidate.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCandidate,

    onSuccess: async () => {
      await invalidateCandidates();

      setDeleteDialogOpen(false);
      setSelectedCandidate(null);

      toast.success(
        "Candidate deleted successfully.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to delete candidate.",
      );
    },
  });

  function openCreateDialog() {
    setSelectedCandidate(null);
    setCandidateDialogOpen(true);
  }

  function openEditDialog(
    candidate: Candidate,
  ) {
    setSelectedCandidate(candidate);
    setCandidateDialogOpen(true);
  }

  function openDeleteDialog(
    candidate: Candidate,
  ) {
    setSelectedCandidate(candidate);
    setDeleteDialogOpen(true);
  }

  function handleSubmit(
    values: CandidateFormValues,
  ) {
    const request = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),

      phone:
        values.phone?.trim() || null,

      location:
        values.location?.trim() || null,

      linkedinUrl:
        values.linkedinUrl?.trim() || null,

      portfolioUrl:
        values.portfolioUrl?.trim() || null,

      source: values.source,

      notes:
        values.notes?.trim() || null,
    };

    if (selectedCandidate) {
      updateMutation.mutate({
        id: selectedCandidate.id,
        request,
      });

      return;
    }

    createMutation.mutate(request);
  }

  function confirmDelete() {
    if (!selectedCandidate) {
      return;
    }

    deleteMutation.mutate(
      selectedCandidate.id,
    );
  }

  return (
    <div
      className="space-y-8"
      style={{ padding: "2rem" }}
    >
      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Candidates
            </h1>
          </div>

          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage your talent database and
            candidate profiles across your
            workspace.
          </p>
        </div>

        <Button
          size="lg"
          onClick={openCreateDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add candidate
        </Button>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total candidates"
          value={statistics.total}
          description="Talent database"
          icon={Users}
        />

        <StatCard
          title="Added this month"
          value={statistics.addedThisMonth}
          description="New candidates"
          icon={UserRound}
        />

        <StatCard
          title="LinkedIn"
          value={statistics.linkedin}
          description="Sourced from LinkedIn"
          icon={Users}
        />

        <StatCard
          title="Referrals"
          value={statistics.referrals}
          description="Employee referrals"
          icon={Users}
        />
      </div>

      {/* Candidate list */}

      <Card>
        <CardHeader className="border-b pb-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg">
                Talent database
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {filteredCandidates.length}{" "}
                {filteredCandidates.length === 1
                  ? "candidate"
                  : "candidates"}{" "}
                shown
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="relative sm:w-[300px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search candidates..."
                  className="pl-9"
                />
              </div>

              <Select
                value={sourceFilter}
                onValueChange={(value) =>
                  setSourceFilter(
                    value as SourceFilter,
                  )
                }
              >
                <SelectTrigger className="sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">
                    All sources
                  </SelectItem>

                  <SelectItem value="LINKEDIN">
                    LinkedIn
                  </SelectItem>

                  <SelectItem value="REFERRAL">
                    Referral
                  </SelectItem>

                  <SelectItem value="CAREERS_PAGE">
                    Careers page
                  </SelectItem>

                  <SelectItem value="RECRUITER">
                    Recruiter
                  </SelectItem>

                  <SelectItem value="AGENCY">
                    Agency
                  </SelectItem>

                  <SelectItem value="JOB_BOARD">
                    Job board
                  </SelectItem>

                  <SelectItem value="MANUAL">
                    Manual
                  </SelectItem>

                  <SelectItem value="OTHER">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {candidatesQuery.isLoading ? (
            <CandidatesLoadingState />
          ) : candidatesQuery.isError ? (
            <div className="px-6 py-16 text-center">
              <h3 className="font-semibold">
                Unable to load candidates
              </h3>

              <Button
                variant="outline"
                className="mt-5"
                onClick={() =>
                  candidatesQuery.refetch()
                }
              >
                Try again
              </Button>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <EmptyCandidatesState
              filtered={
                Boolean(search) ||
                sourceFilter !== "ALL"
              }
              onCreate={openCreateDialog}
              onClear={() => {
                setSearch("");
                setSourceFilter("ALL");
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="min-w-[260px] pl-6">
                      Candidate
                    </TableHead>

                    <TableHead>
                      Location
                    </TableHead>

                    <TableHead>
                      Source
                    </TableHead>

                    <TableHead>
                      Added
                    </TableHead>

                    <TableHead className="w-[70px]" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCandidates.map(
                    (candidate) => (
                      <TableRow
                        key={candidate.id}
                        className="group"
                      >
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <CandidateAvatar
                              candidate={candidate}
                            />

                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/candidates/${candidate.id}`,
                                  )
                                }
                                className="font-medium hover:underline"
                              >
                                {
                                  candidate.fullName
                                }
                              </button>

                              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />

                                <span>
                                  {candidate.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />

                            <span>
                              {candidate.location ??
                                "—"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">
                            {sourceLabel(
                              candidate.source,
                            )}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(
                            candidate.createdAt,
                          )}
                        </TableCell>

                        <TableCell className="pr-5">
                          <CandidateActions
                            candidate={
                              candidate
                            }
                            onView={() =>
                              navigate(
                                `/candidates/${candidate.id}`,
                              )
                            }
                            onEdit={() =>
                              openEditDialog(
                                candidate,
                              )
                            }
                            onDelete={() =>
                              openDeleteDialog(
                                candidate,
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CandidateDialog
        open={candidateDialogOpen}
        candidate={selectedCandidate}
        submitting={
          createMutation.isPending ||
          updateMutation.isPending
        }
        onOpenChange={(open) => {
          setCandidateDialogOpen(open);

          if (!open) {
            setSelectedCandidate(null);
          }
        }}
        onSubmit={handleSubmit}
      />

      <DeleteCandidateDialog
        open={deleteDialogOpen}
        candidate={selectedCandidate}
        loading={deleteMutation.isPending}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);

          if (!open) {
            setSelectedCandidate(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function CandidateActions({
  candidate,
  onView,
  onEdit,
  onDelete,
}: {
  candidate: Candidate;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={`Actions for ${candidate.fullName}`}
        >
          <MoreHorizontal className="h-4 w-4" cursor={'pointer'}/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
				Manage candidate
				<DropdownMenuSeparator />
				<DropdownMenuItem style={{ cursor: 'pointer' }} onClick={onView}> 
					<Eye />
					View candidate
				</DropdownMenuItem>

        <DropdownMenuItem style={{ cursor: 'pointer' }} onClick={onEdit}> 
					<Pencil />
					Edit candidate
				</DropdownMenuItem>

        <DropdownMenuItem style={{ cursor: 'pointer' }} onClick={onDelete}> 
					<Trash2 />
					Delete candidate
				</DropdownMenuItem>
				
			</DropdownMenuContent>
    </DropdownMenu>
  );
}

function CandidateAvatar({
  candidate,
}: {
  candidate: Candidate;
}) {
  const initials =
    `${candidate.firstName.charAt(0)}${candidate.lastName.charAt(0)}`
      .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
      {initials}
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: typeof Users;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyCandidatesState({
  filtered,
  onCreate,
  onClear,
}: {
  filtered: boolean;
  onCreate: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <Users className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold">
        {filtered
          ? "No matching candidates"
          : "Add your first candidate"}
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {filtered
          ? "No candidates match your current search or source filter."
          : "Build your talent database by adding candidates and their contact information."}
      </p>

      {filtered ? (
        <Button
          variant="outline"
          className="mt-6"
          onClick={onClear}
        >
          Clear filters
        </Button>
      ) : (
        <Button
          className="mt-6"
          onClick={onCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add candidate
        </Button>
      )}
    </div>
  );
}

function CandidatesLoadingState() {
  return (
    <div className="divide-y">
      {Array.from({ length: 5 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-6 py-5"
          >
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />

            <div className="flex-1">
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />

              <div className="mt-2 h-3 w-36 animate-pulse rounded bg-muted" />
            </div>

            <div className="hidden h-4 w-24 animate-pulse rounded bg-muted md:block" />
          </div>
        ),
      )}
    </div>
  );
}

function sourceLabel(
  source: CandidateSource,
) {
  const labels: Record<
    CandidateSource,
    string
  > = {
    CAREERS_PAGE: "Careers page",
    LINKEDIN: "LinkedIn",
    REFERRAL: "Referral",
    RECRUITER: "Recruiter",
    AGENCY: "Agency",
    JOB_BOARD: "Job board",
    MANUAL: "Manual",
    OTHER: "Other",
  };

  return labels[source];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}