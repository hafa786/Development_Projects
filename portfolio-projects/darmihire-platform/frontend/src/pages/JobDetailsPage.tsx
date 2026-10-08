import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  MapPin,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getJob } from "@/features/jobs/api";
import { jobQueryKeys } from "@/features/jobs/queryKeys";

import {
  createApplication,
  getApplicationsByJob,
  rejectApplication,
  updateApplicationStage,
  withdrawApplication,
} from "@/features/applications/api";

import { applicationQueryKeys } from "@/features/applications/queryKeys";

import { ApplicationPipeline } from "@/features/applications/ApplicationPipeline";
import { AddCandidateDialog } from "@/features/applications/AddCandidateDialog";
import { RejectApplicationDialog } from "@/features/applications/RejectApplicationDialog";

import type {
  ApplicationStage,
  JobApplication,
} from "@/features/applications/types";

import { getTenantId } from "@/utils/session";

export default function JobDetailsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { jobId } = useParams<{
    jobId: string;
  }>();

  const tenantId = getTenantId();

  /*
   * Dialog state
   */
  const [
    addCandidateOpen,
    setAddCandidateOpen,
  ] = useState(false);

  const [
    rejectDialogOpen,
    setRejectDialogOpen,
  ] = useState(false);

  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState<JobApplication | null>(null);

  /*
   * Job
   */
  const jobQuery = useQuery({
    queryKey: jobQueryKeys.detail(
      jobId ?? "",
    ),

    queryFn: () => getJob(jobId!),

    enabled:
      Boolean(tenantId) &&
      Boolean(jobId),
  });

  /*
   * Applications
   */
  const applicationsQuery = useQuery({
    queryKey: applicationQueryKeys.job(
      tenantId,
      jobId ?? "",
    ),

    queryFn: () =>
      getApplicationsByJob(jobId!),

    enabled:
      Boolean(tenantId) &&
      Boolean(jobId),
  });

  const job = jobQuery.data;

  const applications =
    applicationsQuery.data ?? [];

  /*
   * Pipeline statistics
   */
  const activeApplications =
    applications.filter(
      (application) =>
        application.status === "ACTIVE",
    );

  const hiredApplications =
    applications.filter(
      (application) =>
        application.status === "HIRED",
    );

  const rejectedApplications =
    applications.filter(
      (application) =>
        application.status === "REJECTED",
    );

  const withdrawnApplications =
    applications.filter(
      (application) =>
        application.status === "WITHDRAWN",
    );

  /*
   * Query invalidation
   */
  const invalidateApplications = () =>
    queryClient.invalidateQueries({
      queryKey: applicationQueryKeys.job(
        tenantId,
        jobId ?? "",
      ),
    });

  /*
   * Create application
   */
  const createApplicationMutation =
    useMutation({
      mutationFn: (
        candidateId: string,
      ) =>
        createApplication({
          jobId: jobId!,
          candidateId,
        }),

      onSuccess: async () => {
        await invalidateApplications();

        setAddCandidateOpen(false);

        toast.success(
          "Candidate added to pipeline.",
        );
      },

      onError: (error: Error) => {
        toast.error(
          error.message ||
            "Failed to add candidate.",
        );
      },
    });

  /*
   * Update pipeline stage
   */
  const stageMutation = useMutation({
    mutationFn: ({
      applicationId,
      stage,
    }: {
      applicationId: string;
      stage: ApplicationStage;
    }) =>
      updateApplicationStage(
        applicationId,
        {
          stage,
        },
      ),

    onSuccess: async () => {
      await invalidateApplications();

      toast.success(
        "Application stage updated.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to update application stage.",
      );
    },
  });

  /*
   * Reject application
   */
  const rejectMutation = useMutation({
    mutationFn: ({
      applicationId,
      reason,
    }: {
      applicationId: string;
      reason: string;
    }) =>
      rejectApplication(
        applicationId,
        {
          reason:
            reason.trim() || null,
        },
      ),

    onSuccess: async () => {
      await invalidateApplications();

      setRejectDialogOpen(false);
      setSelectedApplication(null);

      toast.success(
        "Application rejected.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to reject application.",
      );
    },
  });

  /*
   * Withdraw application
   */
  const withdrawMutation = useMutation({
    mutationFn: withdrawApplication,

    onSuccess: async () => {
      await invalidateApplications();

      toast.success(
        "Application withdrawn.",
      );
    },

    onError: (error: Error) => {
      toast.error(
        error.message ||
          "Failed to withdraw application.",
      );
    },
  });

  /*
   * Pipeline handlers
   */
  function handleMoveApplication(
    application: JobApplication,
    stage: ApplicationStage,
  ) {
    stageMutation.mutate({
      applicationId: application.id,
      stage,
    });
  }

  function handleRejectApplication(
    application: JobApplication,
  ) {
    setSelectedApplication(application);
    setRejectDialogOpen(true);
  }

  function handleWithdrawApplication(
    application: JobApplication,
  ) {
    withdrawMutation.mutate(
      application.id,
    );
  }

  /*
   * Loading job
   */
  if (jobQuery.isLoading) {
    return (
      <div className="p-8">
        <div className="space-y-5">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />

          <div className="h-10 w-80 animate-pulse rounded bg-muted" />

          <div className="h-5 w-56 animate-pulse rounded bg-muted" />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-64 animate-pulse rounded-xl bg-muted lg:col-span-2" />

            <div className="h-64 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  /*
   * Job not found / failed
   */
  if (jobQuery.isError || !job) {
    return (
      <div className="space-y-5 p-8">
        <Button
          variant="ghost"
          className="-ml-2"
          onClick={() =>
            navigate("/jobs")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs
        </Button>

        <Card>
          <CardContent className="py-16 text-center">
            <BriefcaseBusiness className="mx-auto h-10 w-10 text-muted-foreground" />

            <h2 className="mt-4 text-lg font-semibold">
              Job not found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              The requested job could not
              be loaded.
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={() =>
                jobQuery.refetch()
              }
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Back navigation */}

      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() =>
          navigate("/jobs")
        }
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to jobs
      </Button>

      {/* Job header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <BriefcaseBusiness className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {job.title}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {job.jobCode}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <JobStatusBadge
              status={job.status}
            />

            {job.employmentType && (
              <Badge variant="outline">
                {formatEnum(
                  job.employmentType,
                )}
              </Badge>
            )}

            {job.workplaceType && (
              <Badge variant="outline">
                {formatEnum(
                  job.workplaceType,
                )}
              </Badge>
            )}
          </div>
        </div>

        <Button
          onClick={() =>
            setAddCandidateOpen(true)
          }
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add candidate
        </Button>
      </div>

      {/* Job information */}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}

          <Card>
            <CardHeader>
              <CardTitle>
                Job description
              </CardTitle>
            </CardHeader>

            <CardContent>
              {job.description ? (
                <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {job.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No job description has
                  been added.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Job sidebar */}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Job information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <InfoRow
                icon={Building2}
                label="Department"
                value={
                  job.departmentName
                }
              />

              <InfoRow
                icon={Users}
                label="Team"
                value={job.teamName}
              />

              <InfoRow
                icon={MapPin}
                label="Location"
                value={
                  job.locationName
                }
              />

              <InfoRow
                icon={UserRound}
                label="Recruiter"
                value={
                  job.recruiterName
                }
              />

              <InfoRow
                icon={UserRound}
                label="Hiring manager"
                value={
                  job.hiringManagerName
                }
              />

              <InfoRow
                icon={BriefcaseBusiness}
                label="Openings"
                value={String(
                  job.openings ?? 1,
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hiring pipeline */}

      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />

              <h2 className="text-xl font-semibold">
                Hiring pipeline
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Track candidates through the
              recruitment process for this
              position.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              setAddCandidateOpen(true)
            }
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add candidate
          </Button>
        </div>

        {/* Pipeline statistics */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <PipelineStat
            label="Applications"
            value={applications.length}
          />

          <PipelineStat
            label="Active"
            value={
              activeApplications.length
            }
          />

          <PipelineStat
            label="Hired"
            value={
              hiredApplications.length
            }
          />

          <PipelineStat
            label="Rejected"
            value={
              rejectedApplications.length
            }
          />

          <PipelineStat
            label="Withdrawn"
            value={
              withdrawnApplications.length
            }
          />
        </div>

        {/* Pipeline board */}

        {applicationsQuery.isLoading ? (
          <PipelineLoadingState />
        ) : applicationsQuery.isError ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-9 w-9 text-muted-foreground" />

              <h3 className="mt-4 font-semibold">
                Unable to load pipeline
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                The applications for this
                job could not be loaded.
              </p>

              <Button
                variant="outline"
                className="mt-5"
                onClick={() =>
                  applicationsQuery.refetch()
                }
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : applications.length === 0 ? (
          <EmptyPipeline
            onAdd={() =>
              setAddCandidateOpen(true)
            }
          />
        ) : (
          <ApplicationPipeline
            applications={
              applications
            }
            onMove={
              handleMoveApplication
            }
            onReject={
              handleRejectApplication
            }
            onWithdraw={
              handleWithdrawApplication
            }
          />
        )}

        {/* Rejected / withdrawn */}

        {(rejectedApplications.length >
          0 ||
          withdrawnApplications.length >
            0) && (
          <InactiveApplications
            rejected={
              rejectedApplications
            }
            withdrawn={
              withdrawnApplications
            }
          />
        )}
      </section>

      {/* Add candidate dialog */}

      <AddCandidateDialog
        open={addCandidateOpen}
        applications={applications}
        submitting={
          createApplicationMutation.isPending
        }
        onOpenChange={
          setAddCandidateOpen
        }
        onAdd={(candidateId) =>
          createApplicationMutation.mutate(
            candidateId,
          )
        }
      />

      {/* Reject dialog */}

      <RejectApplicationDialog
        open={rejectDialogOpen}
        application={
          selectedApplication
        }
        submitting={
          rejectMutation.isPending
        }
        onOpenChange={(open) => {
          setRejectDialogOpen(open);

          if (!open) {
            setSelectedApplication(
              null,
            );
          }
        }}
        onConfirm={(reason) => {
          if (!selectedApplication) {
            return;
          }

          rejectMutation.mutate({
            applicationId:
              selectedApplication.id,
            reason,
          });
        }}
      />
    </div>
  );
}

/*
 * Job information row
 */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 break-words text-sm font-medium">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

/*
 * Pipeline statistic
 */
function PipelineStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 text-2xl font-semibold tracking-tight">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

/*
 * Empty pipeline
 */
function EmptyPipeline({
  onAdd,
}: {
  onAdd: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>

        <h3 className="mt-5 text-lg font-semibold">
          No candidates in this pipeline
        </h3>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Add a candidate from your talent
          database to start the hiring
          process for this position.
        </p>

        <Button
          className="mt-6"
          onClick={onAdd}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add candidate
        </Button>
      </CardContent>
    </Card>
  );
}

/*
 * Pipeline loading state
 */
function PipelineLoadingState() {
  return (
    <div className="overflow-hidden">
      <div className="grid min-w-[1000px] grid-cols-5 gap-4">
        {Array.from({
          length: 5,
        }).map((_, column) => (
          <div
            key={column}
            className="rounded-xl bg-muted/40 p-3"
          >
            <div className="mb-4 h-5 w-24 animate-pulse rounded bg-muted" />

            <div className="space-y-3">
              {Array.from({
                length: 2,
              }).map((_, card) => (
                <div
                  key={card}
                  className="h-28 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
 * Closed applications
 */
function InactiveApplications({
  rejected,
  withdrawn,
}: {
  rejected: JobApplication[];
  withdrawn: JobApplication[];
}) {
  const navigate = useNavigate();

  const applications = [
    ...rejected,
    ...withdrawn,
  ].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime(),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Closed applications
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Rejected and withdrawn
          candidates are kept here for
          hiring history.
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {applications.map(
            (application) => (
              <div
                key={application.id}
                className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    {application.candidateFirstName
                      .charAt(0)
                      .toUpperCase()}

                    {application.candidateLastName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/candidates/${application.candidateId}`,
                        )
                      }
                      className="font-medium hover:underline"
                    >
                      {
                        application.candidateFullName
                      }
                    </button>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {
                        application.candidateEmail
                      }
                    </p>

                    {application.status ===
                      "REJECTED" &&
                      application.rejectionReason && (
                        <p className="mt-2 max-w-xl text-xs text-muted-foreground">
                          {
                            application.rejectionReason
                          }
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {formatEnum(
                      application.stage,
                    )}
                  </Badge>

                  <ApplicationStatusBadge
                    status={
                      application.status
                    }
                  />
                </div>
              </div>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/*
 * Job status badge
 */
function JobStatusBadge({
  status,
}: {
  status: string;
}) {
  switch (status) {
    case "OPEN":
      return (
        <Badge>
          Open
        </Badge>
      );

    case "PAUSED":
      return (
        <Badge variant="secondary">
          Paused
        </Badge>
      );

    case "CLOSED":
      return (
        <Badge variant="outline">
          Closed
        </Badge>
      );

    default:
      return (
        <Badge variant="secondary">
          Draft
        </Badge>
      );
  }
}

/*
 * Application status badge
 */
function ApplicationStatusBadge({
  status,
}: {
  status:
    | "ACTIVE"
    | "HIRED"
    | "REJECTED"
    | "WITHDRAWN";
}) {
  switch (status) {
    case "HIRED":
      return (
        <Badge>
          Hired
        </Badge>
      );

    case "REJECTED":
      return (
        <Badge variant="destructive">
          Rejected
        </Badge>
      );

    case "WITHDRAWN":
      return (
        <Badge variant="secondary">
          Withdrawn
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          Active
        </Badge>
      );
  }
}

/*
 * Enum formatter
 *
 * FULL_TIME -> Full Time
 * ON_SITE   -> On Site
 * SCREENING -> Screening
 */
function formatEnum(
  value?: string | null,
) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}