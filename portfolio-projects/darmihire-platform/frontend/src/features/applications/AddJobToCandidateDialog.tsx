import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  Check,
  MapPin,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { getJobs } from "@/features/jobs/api";
import { jobQueryKeys } from "@/features/jobs/queryKeys";

import type { Job } from "@/features/jobs/types";
import type { JobApplication } from "./types";

import { getTenantId } from "@/utils/session";

type AddJobToCandidateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  applications: JobApplication[];

  onAdd: (jobId: string) => void;

  isPending?: boolean;
};

export function AddJobToCandidateDialog({
  open,
  onOpenChange,
  applications,
  onAdd,
  isPending = false,
}: AddJobToCandidateDialogProps) {
  const tenantId = getTenantId();

  const [search, setSearch] =
    useState("");

  const jobsQuery = useQuery({
    queryKey: jobQueryKeys.list(
      tenantId,
    ),

    queryFn: getJobs,

    enabled:
      open && Boolean(tenantId),
  });

  /*
   * Jobs the candidate already has
   * applications for.
   */
  const existingJobIds = useMemo(
    () =>
      new Set(
        applications.map(
          (application) =>
            application.jobId,
        ),
      ),
    [applications],
  );

  /*
   * Only show:
   *
   * - OPEN jobs
   * - jobs candidate has not
   *   already applied to
   * - jobs matching search
   */
  const availableJobs = useMemo(
    () => {
      const query = search
        .trim()
        .toLowerCase();

      return (jobsQuery.data ?? [])
        .filter(
          (job) =>
            job.status === "OPEN",
        )
        .filter(
          (job) =>
            !existingJobIds.has(
              job.id,
            ),
        )
        .filter((job) => {
          if (!query) {
            return true;
          }

          return [
            job.title,
            job.jobCode,
            job.locationName,
            job.departmentName,
            job.teamName,
          ]
            .filter(Boolean)
            .some((value) =>
              value!
                .toLowerCase()
                .includes(query),
            );
        });
    },
    [
      jobsQuery.data,
      existingJobIds,
      search,
    ],
  );

  function handleOpenChange(
    nextOpen: boolean,
  ) {
    if (!nextOpen) {
      setSearch("");
    }

    onOpenChange(nextOpen);
  }

  function handleAdd(
    job: Job,
  ) {
    onAdd(job.id);
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
            Add candidate to job
          </DialogTitle>

          <DialogDescription>
            Select an open job to add
            this candidate to its
            recruitment pipeline.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search by job title, code, location..."
            className="pl-9"
          />
        </div>

        {/* Jobs */}

        <div className="max-h-[420px] overflow-y-auto pr-1">
          {jobsQuery.isLoading ? (
            <JobsLoadingState />
          ) : jobsQuery.isError ? (
            <JobsErrorState
              onRetry={() =>
                jobsQuery.refetch()
              }
            />
          ) : availableJobs.length ===
            0 ? (
            <EmptyJobsState
              hasSearch={
                Boolean(
                  search.trim(),
                )
              }
            />
          ) : (
            <div className="space-y-2">
              {availableJobs.map(
                (job) => (
                  <JobOption
                    key={job.id}
                    job={job}
                    isPending={
                      isPending
                    }
                    onAdd={() =>
                      handleAdd(job)
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() =>
              handleOpenChange(
                false,
              )
            }
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function JobOption({
  job,
  onAdd,
  isPending,
}: {
  job: Job;
  onAdd: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 shrink-0 text-muted-foreground" />

          <p className="font-medium">
            {job.title}
          </p>

          <Badge variant="outline">
            {job.jobCode}
          </Badge>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {job.locationName && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />

              {job.locationName}
            </span>
          )}

          {job.departmentName && (
            <span>
              {job.departmentName}
            </span>
          )}

          {job.teamName && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />

              {job.teamName}
            </span>
          )}
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        disabled={isPending}
        onClick={onAdd}
        className="shrink-0"
      >
        <Check className="mr-2 h-4 w-4" />
        Add
      </Button>
    </div>
  );
}

function JobsLoadingState() {
  return (
    <div className="space-y-3 py-2">
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border p-4"
        >
          <div className="h-4 w-56 animate-pulse rounded bg-muted" />

          <div className="mt-3 h-3 w-36 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function JobsErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BriefcaseBusiness className="h-8 w-8 text-muted-foreground" />

      <p className="mt-3 font-medium">
        Unable to load jobs
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Open jobs could not be
        loaded.
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  );
}

function EmptyJobsState({
  hasSearch,
}: {
  hasSearch: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BriefcaseBusiness className="h-8 w-8 text-muted-foreground" />

      <p className="mt-3 font-medium">
        {hasSearch
          ? "No matching jobs"
          : "No available jobs"}
      </p>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasSearch
          ? "Try a different job title, code, location, department, or team."
          : "There are no open jobs available, or this candidate has already been added to all open jobs."}
      </p>
    </div>
  );
}