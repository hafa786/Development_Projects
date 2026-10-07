import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  Building2,
  CirclePause,
  Clock3,
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
  DropdownMenuLabel,
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
  createJob,
  deleteJob,
  getJobs,
  updateJob,
  updateJobStatus,
} from "@/features/jobs/api";

import { jobQueryKeys } from "@/features/jobs/queryKeys";
import { JobDialog } from "@/features/jobs/JobDialog";
import { JobStatusDialog } from "@/features/jobs/JobStatusDialog";
import { DeleteJobDialog } from "@/features/jobs/DeleteJobDialog";

import type {
  Job,
  JobStatus,
} from "@/features/jobs/types";

import type { JobFormValues } from "@/features/jobs/schemas";

import { getTenantId } from "@/utils/session";

type StatusFilter =
  | "ALL"
  | "DRAFT"
  | "OPEN"
  | "PAUSED"
  | "CLOSED";

export default function JobsPage() {
  const tenantId = getTenantId();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [jobDialogOpen, setJobDialogOpen] =
    useState(false);

  const [selectedJob, setSelectedJob] =
    useState<Job | null>(null);

  const [
    statusDialogOpen,
    setStatusDialogOpen,
  ] = useState(false);

  const [targetStatus, setTargetStatus] =
    useState<JobStatus | null>(null);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const jobsQuery = useQuery({
    queryKey: jobQueryKeys.list(tenantId),
    queryFn: getJobs,
    enabled: Boolean(tenantId),
  });

  const jobs = jobsQuery.data ?? [];

  const statistics = useMemo(
    () => ({
      total: jobs.length,
      open: jobs.filter(
        (job) => job.status === "OPEN",
      ).length,
      draft: jobs.filter(
        (job) => job.status === "DRAFT",
      ).length,
      paused: jobs.filter(
        (job) => job.status === "PAUSED",
      ).length,
    }),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title
          .toLowerCase()
          .includes(query) ||
        job.jobCode
          .toLowerCase()
          .includes(query) ||
        job.departmentName
          ?.toLowerCase()
          .includes(query) ||
        job.teamName
          ?.toLowerCase()
          .includes(query) ||
        job.locationName
          ?.toLowerCase()
          .includes(query) ||
        job.recruiterName
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        job.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [jobs, search, statusFilter]);

  const invalidateJobs = () =>
    queryClient.invalidateQueries({
      queryKey:
        jobQueryKeys.list(tenantId),
    });

  const createMutation = useMutation({
    mutationFn: createJob,

    onSuccess: async () => {
      await invalidateJobs();

      setJobDialogOpen(false);
      setSelectedJob(null);

      toast.success(
        "Job created successfully.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to create job.",
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
        typeof updateJob
      >[1];
    }) => updateJob(id, request),

    onSuccess: async () => {
      await invalidateJobs();

      setJobDialogOpen(false);
      setSelectedJob(null);

      toast.success(
        "Job updated successfully.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to update job.",
      );
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: JobStatus;
    }) =>
      updateJobStatus(id, {
        status,
      }),

    onSuccess: async () => {
      await invalidateJobs();

      setStatusDialogOpen(false);
      setTargetStatus(null);
      setSelectedJob(null);

      toast.success(
        "Job status updated.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to update job status.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,

    onSuccess: async () => {
      await invalidateJobs();

      setDeleteDialogOpen(false);
      setSelectedJob(null);

      toast.success(
        "Job deleted successfully.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to delete job.",
      );
    },
  });

  function openCreateDialog() {
    setSelectedJob(null);
    setJobDialogOpen(true);
  }

  function openEditDialog(job: Job) {
    setSelectedJob(job);
    setJobDialogOpen(true);
  }

  function openStatusDialog(
    job: Job,
    status: JobStatus,
  ) {
    setSelectedJob(job);
    setTargetStatus(status);
    setStatusDialogOpen(true);
  }

  function openDeleteDialog(job: Job) {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  }

  function handleSubmit(
    values: JobFormValues,
  ) {
    const request = {
      title: values.title.trim(),

      description:
        values.description?.trim() ||
        null,

      departmentId:
        values.departmentId || null,

      teamId: values.teamId || null,

      locationId:
        values.locationId || null,

      recruiterId:
        values.recruiterId || null,

      hiringManagerId:
        values.hiringManagerId || null,

      employmentType:
        values.employmentType,

      workplaceType:
        values.workplaceType,

      openings: values.openings,
    };

    if (selectedJob) {
      updateMutation.mutate({
        id: selectedJob.id,
        request,
      });

      return;
    }

    createMutation.mutate({
      ...request,

      jobCode:
        values.jobCode?.trim() ||
        null,
    });
  }

  function confirmStatusChange() {
    if (
      !selectedJob ||
      !targetStatus
    ) {
      return;
    }

    statusMutation.mutate({
      id: selectedJob.id,
      status: targetStatus,
    });
  }

  function confirmDelete() {
    if (!selectedJob) {
      return;
    }

    deleteMutation.mutate(
      selectedJob.id,
    );
  }

  return (
    <div className="space-y-8" style={{padding: '2rem'}}>
      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <BriefcaseBusiness className="h-5 w-5 text-primary" />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Jobs
            </h1>
          </div>

          <p className="max-w-2xl text-sm text-muted-foreground">
            Manage job requisitions,
            hiring ownership and open
            positions across your
            workspace.
          </p>
        </div>

        <Button
          size="lg"
          onClick={openCreateDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create job
        </Button>
      </div>

      {/* Statistics */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total jobs"
          value={statistics.total}
          description="All requisitions"
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Open jobs"
          value={statistics.open}
          description="Currently hiring"
          icon={Users}
        />

        <StatCard
          title="Draft jobs"
          value={statistics.draft}
          description="Not published yet"
          icon={Clock3}
        />

        <StatCard
          title="Paused jobs"
          value={statistics.paused}
          description="Hiring temporarily paused"
          icon={CirclePause}
        />
      </div>

      {/* Jobs */}

      <Card>
        <CardHeader className="border-b pb-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg">
                Job requisitions
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1
                  ? "job"
                  : "jobs"}{" "}
                shown
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="relative sm:w-[300px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search jobs..."
                  className="pl-9"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(
                    value as StatusFilter,
                  )
                }
              >
                <SelectTrigger className="sm:w-[170px]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">
                    All statuses
                  </SelectItem>

                  <SelectItem value="OPEN">
                    Open
                  </SelectItem>

                  <SelectItem value="DRAFT">
                    Draft
                  </SelectItem>

                  <SelectItem value="PAUSED">
                    Paused
                  </SelectItem>

                  <SelectItem value="CLOSED">
                    Closed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {jobsQuery.isLoading ? (
            <JobsLoadingState />
          ) : jobsQuery.isError ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <BriefcaseBusiness className="h-5 w-5 text-destructive" />
              </div>

              <h3 className="font-semibold">
                Unable to load jobs
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Something went wrong while
                loading your job
                requisitions.
              </p>

              <Button
                variant="outline"
                className="mt-5"
                onClick={() =>
                  jobsQuery.refetch()
                }
              >
                Try again
              </Button>
            </div>
          ) : filteredJobs.length ===
            0 ? (
            <EmptyJobsState
              filtered={
                Boolean(search) ||
                statusFilter !== "ALL"
              }
              onCreate={
                openCreateDialog
              }
              onClear={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="min-w-[260px] pl-6">
                      Position
                    </TableHead>

                    <TableHead>
                      Team
                    </TableHead>

                    <TableHead>
                      Location
                    </TableHead>

                    <TableHead>
                      Recruiter
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead className="text-center">
                      Openings
                    </TableHead>

                    <TableHead className="w-[70px]" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredJobs.map(
                    (job) => (
                      <TableRow
                        key={job.id}
                        className="group"
                      >
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
                              <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                            </div>

                            <div className="min-w-0">
                              <div className="font-medium text-foreground">
                                {job.title}
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                <span>
                                  {job.jobCode}
                                </span>

                                <span>
                                  •
                                </span>

                                <span>
                                  {employmentTypeLabel(
                                    job.employmentType,
                                  )}
                                </span>

                                <span>
                                  •
                                </span>

                                <span>
                                  {workplaceTypeLabel(
                                    job.workplaceType,
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />

                              <span>
                                {job.departmentName ??
                                  "—"}
                              </span>
                            </div>

                            {job.teamName && (
                              <div className="pl-5 text-xs text-muted-foreground">
                                {
                                  job.teamName
                                }
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                            <span>
                              {job.locationName ??
                                (job.workplaceType ===
                                "REMOTE"
                                  ? "Remote"
                                  : "—")}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          {job.recruiterName ? (
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                                <UserRound className="h-3.5 w-3.5 text-muted-foreground" />
                              </div>

                              <span className="max-w-[150px] truncate text-sm">
                                {
                                  job.recruiterName
                                }
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Unassigned
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <JobStatusBadge
                            status={
                              job.status
                            }
                          />
                        </TableCell>

                        <TableCell className="text-center">
                          <span className="inline-flex min-w-8 justify-center rounded-md bg-muted px-2 py-1 text-sm font-medium">
                            {job.openings}
                          </span>
                        </TableCell>

                        <TableCell className="pr-5">
                          <JobActions
                            job={job}
                            onEdit={() =>
                              openEditDialog(
                                job,
                              )
                            }
                            onStatusChange={(
                              status,
                            ) =>
                              openStatusDialog(
                                job,
                                status,
                              )
                            }
                            onDelete={() =>
                              openDeleteDialog(
                                job,
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

      {/* Dialogs */}

      <JobDialog
        open={jobDialogOpen}
        job={selectedJob}
        submitting={
          createMutation.isPending ||
          updateMutation.isPending
        }
        onOpenChange={(open) => {
          setJobDialogOpen(open);

          if (!open) {
            setSelectedJob(null);
          }
        }}
        onSubmit={handleSubmit}
      />

      <JobStatusDialog
        open={statusDialogOpen}
        job={selectedJob}
        status={targetStatus}
        loading={
          statusMutation.isPending
        }
        onOpenChange={(open) => {
          setStatusDialogOpen(open);

          if (!open) {
            setSelectedJob(null);
            setTargetStatus(null);
          }
        }}
        onConfirm={
          confirmStatusChange
        }
      />

      <DeleteJobDialog
        open={deleteDialogOpen}
        job={selectedJob}
        loading={
          deleteMutation.isPending
        }
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);

          if (!open) {
            setSelectedJob(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

/* ------------------------------------------------ */
/* Stat Card                                        */
/* ------------------------------------------------ */

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: typeof BriefcaseBusiness;
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
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

/* ------------------------------------------------ */
/* Job actions                                      */
/* ------------------------------------------------ */

type JobActionsProps = {
  job: Job;
  onEdit: () => void;
  onStatusChange: (
    status: JobStatus,
  ) => void;
  onDelete: () => void;
};

function JobActions({
  job,
  onEdit,
  onStatusChange,
  onDelete,
}: JobActionsProps) {
  const statuses =
    availableStatuses(job.status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={`Actions for ${job.title}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52"
      >
        <DropdownMenuLabel>
          Job actions
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onEdit}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit job
        </DropdownMenuItem>

        {statuses.length > 0 && (
          <>
            <DropdownMenuSeparator />

            {statuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() =>
                  onStatusChange(status)
                }
              >
                {statusActionLabel(
                  status,
                )}
              </DropdownMenuItem>
            ))}
          </>
        )}

        {job.status === "DRAFT" && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete job
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------------------------------ */
/* Status Badge                                     */
/* ------------------------------------------------ */

function JobStatusBadge({
  status,
}: {
  status: JobStatus;
}) {
  switch (status) {
    case "OPEN":
      return (
        <Badge className="gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Open
        </Badge>
      );

    case "DRAFT":
      return (
        <Badge
          variant="secondary"
          className="gap-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Draft
        </Badge>
      );

    case "PAUSED":
      return (
        <Badge
          variant="outline"
          className="gap-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Paused
        </Badge>
      );

    case "CLOSED":
      return (
        <Badge
          variant="secondary"
          className="gap-1.5 opacity-70"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Closed
        </Badge>
      );
  }
}

/* ------------------------------------------------ */
/* Empty State                                      */
/* ------------------------------------------------ */

function EmptyJobsState({
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
        <BriefcaseBusiness className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold">
        {filtered
          ? "No matching jobs"
          : "Create your first job"}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {filtered
          ? "No job requisitions match your current search or status filter."
          : "Create a job requisition and assign recruiters, hiring managers, teams and locations."}
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
          Create job
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------ */
/* Loading State                                    */
/* ------------------------------------------------ */

function JobsLoadingState() {
  return (
    <div className="divide-y">
      {Array.from({ length: 5 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-6 py-5"
          >
            <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />

            <div className="flex-1">
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />

              <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
            </div>

            <div className="hidden h-4 w-24 animate-pulse rounded bg-muted md:block" />

            <div className="hidden h-6 w-16 animate-pulse rounded-full bg-muted lg:block" />
          </div>
        ),
      )}
    </div>
  );
}

/* ------------------------------------------------ */
/* Helpers                                          */
/* ------------------------------------------------ */

function availableStatuses(
  status: JobStatus,
): JobStatus[] {
  switch (status) {
    case "DRAFT":
      return ["OPEN"];

    case "OPEN":
      return [
        "PAUSED",
        "CLOSED",
      ];

    case "PAUSED":
      return [
        "OPEN",
        "CLOSED",
      ];

    case "CLOSED":
      return [];
  }
}

function statusActionLabel(
  status: JobStatus,
) {
  switch (status) {
    case "OPEN":
      return "Open job";

    case "PAUSED":
      return "Pause hiring";

    case "CLOSED":
      return "Close job";

    case "DRAFT":
      return "Move to draft";
  }
}

function employmentTypeLabel(
  type: Job["employmentType"],
) {
  const labels = {
    FULL_TIME: "Full time",
    PART_TIME: "Part time",
    CONTRACT: "Contract",
    TEMPORARY: "Temporary",
    INTERNSHIP: "Internship",
  };

  return labels[type];
}

function workplaceTypeLabel(
  type: Job["workplaceType"],
) {
  const labels = {
    ON_SITE: "On-site",
    HYBRID: "Hybrid",
    REMOTE: "Remote",
  };

  return labels[type];
}