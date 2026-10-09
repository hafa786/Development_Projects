import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ExternalLink,
  FileText,
  History,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { FaLinkedin } from 'react-icons/fa';

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getCandidate,
} from "@/features/candidates/api";
import {
  candidateQueryKeys,
} from "@/features/candidates/queryKeys";

import {
  getApplicationsByCandidate,
} from "@/features/applications/api";
import {
  applicationQueryKeys,
} from "@/features/applications/queryKeys";
import {
  ApplicationActivityPanel,
} from "@/features/applications/ApplicationActivityPanel";

import type {
  ApplicationStage,
  ApplicationStatus,
  JobApplication,
} from "@/features/applications/types";
import type {
  CandidateSource,
} from "@/features/candidates/types";

import { getTenantId } from "@/utils/session";

export default function CandidateDetailsPage() {
  const navigate = useNavigate();

  const { candidateId } = useParams<{
    candidateId: string;
  }>();

  const tenantId = getTenantId();

  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState<JobApplication | null>(null);

  /*
   * Candidate
   */
  const candidateQuery = useQuery({
    queryKey: candidateQueryKeys.detail(
      tenantId,
      candidateId ?? "",
    ),

    queryFn: () =>
      getCandidate(candidateId!),

    enabled:
      Boolean(tenantId) &&
      Boolean(candidateId),
  });

  /*
   * Candidate applications
   */
  const applicationsQuery = useQuery({
    queryKey:
      applicationQueryKeys.candidate(
        tenantId,
        candidateId ?? "",
      ),

    queryFn: () =>
      getApplicationsByCandidate(
        candidateId!,
      ),

    enabled:
      Boolean(tenantId) &&
      Boolean(candidateId),
  });

  const candidate = candidateQuery.data;

  const applications =
    applicationsQuery.data ?? [];

  /*
   * Loading
   */
  if (candidateQuery.isLoading) {
    return <CandidateLoadingState />;
  }

  /*
   * Error / not found
   */
  if (
    candidateQuery.isError ||
    !candidate
  ) {
    return (
      <div className="space-y-5 p-8">
        <Button
          variant="ghost"
          className="-ml-2"
          onClick={() =>
            navigate("/candidates")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to candidates
        </Button>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <UserRound className="h-10 w-10 text-muted-foreground" />

            <h2 className="mt-4 text-lg font-semibold">
              Candidate not found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              The requested candidate
              could not be loaded.
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={() =>
                candidateQuery.refetch()
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
      {/* Back */}

      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() =>
          navigate("/candidates")
        }
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to candidates
      </Button>

      {/* Candidate header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <CandidateAvatar
            firstName={
              candidate.firstName
            }
            lastName={
              candidate.lastName
            }
          />

          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {candidate.fullName}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />

                {candidate.email}
              </span>

              {candidate.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />

                  {
                    candidate.location
                  }
                </span>
              )}
            </div>

            <div className="mt-3">
              <CandidateSourceBadge
                source={
                  candidate.source
                }
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {candidate.linkedinUrl && (
            <Button
              variant="outline"
              onClick={() =>
                openExternalUrl(
                  candidate.linkedinUrl!,
                )
              }
            >
              <FaLinkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Button>
          )}

          {candidate.portfolioUrl && (
            <Button
              variant="outline"
              onClick={() =>
                openExternalUrl(
                  candidate.portfolioUrl!,
                )
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Portfolio
            </Button>
          )}
        </div>
      </div>

      {/* Candidate information */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Overview */}

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Overview
            </CardTitle>
          </CardHeader>

          <CardContent>
            {candidate.notes ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {candidate.notes}
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-7 w-7 text-muted-foreground" />

                <p className="mt-3 font-medium">
                  No notes
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  No recruiter notes have
                  been added for this
                  candidate.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact */}

        <Card>
          <CardHeader>
            <CardTitle>
              Contact information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <CandidateInfoRow
              icon={Mail}
              label="Email"
              value={
                candidate.email
              }
            />

            <CandidateInfoRow
              icon={Phone}
              label="Phone"
              value={
                candidate.phone
              }
            />

            <CandidateInfoRow
              icon={MapPin}
              label="Location"
              value={
                candidate.location
              }
            />
          </CardContent>
        </Card>

        {/* Online profiles */}

        <Card>
          <CardHeader>
            <CardTitle>
              Online profiles
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {candidate.linkedinUrl ? (
              <ProfileLink
                icon={FaLinkedin}
                label="LinkedIn"
                url={
                  candidate.linkedinUrl
                }
              />
            ) : null}

            {candidate.portfolioUrl ? (
              <ProfileLink
                icon={ExternalLink}
                label="Portfolio"
                url={
                  candidate.portfolioUrl
                }
              />
            ) : null}

            {!candidate.linkedinUrl &&
              !candidate.portfolioUrl && (
                <p className="text-sm text-muted-foreground">
                  No online profiles have
                  been added.
                </p>
              )}
          </CardContent>
        </Card>

        {/* Resume */}

        <Card>
          <CardHeader>
            <CardTitle>
              Resume
            </CardTitle>
          </CardHeader>

          <CardContent>
            {candidate.resumeUrl ? (
              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {candidate.resumeFileName ||
                        "Candidate resume"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Resume document
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    openExternalUrl(
                      candidate.resumeUrl!,
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-8 w-8 text-muted-foreground" />

                <p className="mt-3 font-medium">
                  No resume uploaded
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Resume upload will be
                  available in a later
                  recruitment step.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Candidate metadata */}

        <Card>
          <CardHeader>
            <CardTitle>
              Candidate information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <CandidateInfoRow
              icon={UserRound}
              label="Source"
              value={formatEnum(
                candidate.source,
              )}
            />

            <CandidateInfoRow
              icon={History}
              label="Added"
              value={formatDate(
                candidate.createdAt,
              )}
            />

            <CandidateInfoRow
              icon={History}
              label="Last updated"
              value={formatDate(
                candidate.updatedAt,
              )}
            />
          </CardContent>
        </Card>
      </div>

      {/* Applications */}

      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />

            <h2 className="text-xl font-semibold">
              Applications
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Jobs this candidate has
            applied or been added to.
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            {applicationsQuery.isLoading ? (
              <ApplicationsLoadingState />
            ) : applicationsQuery.isError ? (
              <ApplicationsErrorState
                onRetry={() =>
                  applicationsQuery.refetch()
                }
              />
            ) : applications.length ===
              0 ? (
              <EmptyApplications />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        Job
                      </TableHead>

                      <TableHead>
                        Stage
                      </TableHead>

                      <TableHead>
                        Status
                      </TableHead>

                      <TableHead>
                        Applied
                      </TableHead>

                      <TableHead className="w-[100px] text-right">
                        Activity
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {applications.map(
                      (application) => {
                        const selected =
                          selectedApplication
                            ?.id ===
                          application.id;

                        return (
                          <TableRow
                            key={
                              application.id
                            }
                            className={
                              selected
                                ? "bg-muted/50"
                                : undefined
                            }
                          >
                            <TableCell>
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/jobs/${application.jobId}`,
                                  )
                                }
                                className="text-left"
                              >
                                <p className="font-medium hover:underline">
                                  {
                                    application.jobTitle
                                  }
                                </p>

                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {
                                    application.jobCode
                                  }
                                </p>
                              </button>
                            </TableCell>

                            <TableCell>
                              <ApplicationStageBadge
                                stage={
                                  application.stage
                                }
                              />
                            </TableCell>

                            <TableCell>
                              <ApplicationStatusBadge
                                status={
                                  application.status
                                }
                              />
                            </TableCell>

                            <TableCell className="whitespace-nowrap text-muted-foreground">
                              {formatDate(
                                application.appliedAt,
                              )}
                            </TableCell>

                            <TableCell className="text-right">
                              <Button
                                type="button"
                                variant={
                                  selected
                                    ? "secondary"
                                    : "ghost"
                                }
                                size="sm"
                                onClick={() =>
                                  setSelectedApplication(
                                    application,
                                  )
                                }
                              >
                                <History className="mr-2 h-4 w-4" />

                                {selected
                                  ? "Viewing"
                                  : "View"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Selected application timeline */}

      {selectedApplication && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {
                    selectedApplication.jobTitle
                  }
                </h2>

                <ApplicationStageBadge
                  stage={
                    selectedApplication.stage
                  }
                />

                <ApplicationStatusBadge
                  status={
                    selectedApplication.status
                  }
                />
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Application history ·{" "}
                {
                  selectedApplication.jobCode
                }
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(
                    `/jobs/${selectedApplication.jobId}`,
                  )
                }
              >
                <BriefcaseBusiness className="mr-2 h-4 w-4" />
                View job
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSelectedApplication(
                    null,
                  )
                }
              >
                Close
              </Button>
            </div>
          </div>

          <ApplicationActivityPanel
            applicationId={
              selectedApplication.id
            }
          />
        </section>
      )}
    </div>
  );
}

/*
 * Candidate avatar
 */
function CandidateAvatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const firstInitial =
    firstName
      ?.charAt(0)
      .toUpperCase() ?? "";

  const lastInitial =
    lastName
      ?.charAt(0)
      .toUpperCase() ?? "";

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-semibold text-primary">
      {firstInitial}
      {lastInitial}
    </div>
  );
}

/*
 * Information row
 */
function CandidateInfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
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
 * External profile
 */
function ProfileLink({
  icon: Icon,
  label,
  url,
}: {
  icon: typeof FaLinkedin;
  label: string;
  url: string;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        openExternalUrl(url)
      }
      className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />

        <span className="text-sm font-medium">
          {label}
        </span>
      </div>

      <ExternalLink className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

/*
 * Candidate source
 */
function CandidateSourceBadge({
  source,
}: {
  source: CandidateSource;
}) {
  return (
    <Badge variant="secondary">
      {formatEnum(source)}
    </Badge>
  );
}

/*
 * Application stage
 */
function ApplicationStageBadge({
  stage,
}: {
  stage: ApplicationStage;
}) {
  switch (stage) {
    case "HIRED":
      return (
        <Badge>
          Hired
        </Badge>
      );

    case "OFFER":
      return (
        <Badge variant="secondary">
          Offer
        </Badge>
      );

    case "INTERVIEW":
      return (
        <Badge variant="outline">
          Interview
        </Badge>
      );

    case "SCREENING":
      return (
        <Badge variant="outline">
          Screening
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          Applied
        </Badge>
      );
  }
}

/*
 * Application status
 */
function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
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
 * Applications loading
 */
function ApplicationsLoadingState() {
  return (
    <div className="space-y-4 p-6">
      {Array.from({
        length: 3,
      }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4"
        >
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />

            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-6 w-20 animate-pulse rounded bg-muted" />

          <div className="h-6 w-20 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

/*
 * Applications error
 */
function ApplicationsErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <BriefcaseBusiness className="h-8 w-8 text-muted-foreground" />

      <p className="mt-3 font-medium">
        Unable to load applications
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        The candidate's applications
        could not be loaded.
      </p>

      <Button
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

/*
 * Empty applications
 */
function EmptyApplications() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <BriefcaseBusiness className="h-8 w-8 text-muted-foreground" />

      <p className="mt-3 font-medium">
        No applications yet
      </p>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        This candidate has not been
        added to a job pipeline yet.
      </p>
    </div>
  );
}

/*
 * Loading page
 */
function CandidateLoadingState() {
  return (
    <div className="space-y-8 p-8">
      <div className="h-9 w-40 animate-pulse rounded bg-muted" />

      <div className="flex items-center gap-4">
        <div className="h-16 w-16 animate-pulse rounded-2xl bg-muted" />

        <div className="space-y-3">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />

          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-xl bg-muted lg:col-span-2" />

        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>

      <div className="h-72 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

/*
 * Helpers
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

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}

function openExternalUrl(
  url: string,
) {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer",
  );
}