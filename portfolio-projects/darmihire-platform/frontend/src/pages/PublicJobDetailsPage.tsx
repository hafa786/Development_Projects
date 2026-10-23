import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  MapPin,
  RefreshCw,
  Users,
} from "lucide-react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getPublicCareer,
  getPublicJob,
  submitPublicApplication,
} from "@/features/careers/api";

import type {
  PublicJobApplicationRequest,
  PublicJobApplicationResponse,
} from "@/features/careers/types";

import type { PublicApplicationFormValues } from "@/features/careers/applicationSchema";

import { CareersHeader } from "@/features/careers/components/CareersHeader";
import { PublicApplicationForm } from "@/features/careers/components/PublicApplicationForm";

import { careersQueryKeys } from "@/features/careers/queryKeys";

export default function PublicJobDetailsPage() {
  const { companySlug, jobSlug } = useParams<{
    companySlug: string;
    jobSlug: string;
  }>();

  const company = companySlug ?? "";
  const job = jobSlug ?? "";

  const careerQuery = useQuery({
    queryKey: careersQueryKeys.career(company),

    queryFn: () => getPublicCareer(company),

    enabled: Boolean(company),

    retry: false,
  });

  const jobQuery = useQuery({
    queryKey: careersQueryKeys.job(company, job),

    queryFn: () => getPublicJob(company, job),

    enabled: Boolean(company) && Boolean(job),

    retry: false,
  });

  const applicationMutation = useMutation<
    PublicJobApplicationResponse,
    Error,
    PublicJobApplicationRequest
  >({
    mutationFn: (data) => submitPublicApplication(company, job, data ),
  });

  function handleApplicationSubmit(values: PublicApplicationFormValues) {
    applicationMutation.mutate({
      firstName: values.firstName.trim(),

      lastName: values.lastName.trim(),

      email: values.email.trim(),

      phone: emptyToUndefined(values.phone),

      location: emptyToUndefined(values.location),

      linkedinUrl: emptyToUndefined(values.linkedinUrl),

      portfolioUrl: emptyToUndefined(values.portfolioUrl),

    });
  }

  if (careerQuery.isLoading || jobQuery.isLoading) {
    return <JobDetailsSkeleton />;
  }

  if (
    careerQuery.isError ||
    jobQuery.isError ||
    !careerQuery.data ||
    !jobQuery.data
  ) {
    return (
      <JobNotFoundState
        companySlug={company}
        onRetry={() => {
          void careerQuery.refetch();
          void jobQuery.refetch();
        }}
      />
    );
  }

  const career = careerQuery.data;

  const jobDetails = jobQuery.data;

  return (
    <div className="min-h-screen bg-muted/20">
      <CareersHeader companyName={career.name} />

      <main>
        <section className="border-b bg-background">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <Link
              to={`/careers/${encodeURIComponent(career.slug)}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              All open positions
            </Link>

            <div className="mt-8">
              <div className="flex flex-wrap gap-2">
                <Badge>{employmentTypeLabel(jobDetails.employmentType)}</Badge>

                <Badge variant="outline">
                  {workplaceTypeLabel(jobDetails.workplaceType)}
                </Badge>
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {jobDetails.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                {jobDetails.location && (
                  <JobMetadata icon={MapPin}>{jobDetails.location}</JobMetadata>
                )}

                {jobDetails.department && (
                  <JobMetadata icon={Building2}>
                    {jobDetails.department}
                  </JobMetadata>
                )}

                {jobDetails.team && (
                  <JobMetadata icon={BriefcaseBusiness}>
                    {jobDetails.team}
                  </JobMetadata>
                )}

                {jobDetails.openings > 0 && (
                  <JobMetadata icon={Users}>
                    {jobDetails.openings === 1
                      ? "1 opening"
                      : `${jobDetails.openings} openings`}
                  </JobMetadata>
                )}

                {jobDetails.applicationDeadline && (
                  <JobMetadata icon={CalendarDays}>
                    Apply by {formatDeadline(jobDetails.applicationDeadline)}
                  </JobMetadata>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:px-8 lg:py-16">
          <article className="min-w-0">
            <h2 className="text-2xl font-semibold">About the role</h2>

            <div className="mt-6 whitespace-pre-wrap break-words text-base leading-8 text-muted-foreground">
              {jobDetails.description}
            </div>
          </article>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <PublicApplicationForm
              jobTitle={jobDetails.title}
              isSubmitting={applicationMutation.isPending}
              error={applicationMutation.error?.message ?? null}
              result={applicationMutation.data ?? null}
              onSubmit={handleApplicationSubmit}
            />
          </aside>
        </div>
      </main>

      <footer className="border-t bg-background">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          Powered by{" "}
          <span className="font-semibold text-foreground">
            Darmi
            <span className="text-emerald-600">Hire</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

function JobMetadata({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-2">
      <Icon className="size-4" />

      {children}
    </span>
  );
}

function JobNotFoundState({
  companySlug,
  onRetry,
}: {
  companySlug: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
          <AlertCircle className="size-6 text-muted-foreground" />
        </div>

        <h1 className="mt-5 text-2xl font-semibold">Job unavailable</h1>

        <p className="mt-2 leading-6 text-muted-foreground">
          This position doesn't exist, has expired or is no longer accepting
          applications.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="size-4" />
            Try again
          </Button>

          {companySlug && (
            <Button>
              <Link to={`/careers/${encodeURIComponent(companySlug)}`}>
                View open positions
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function JobDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-9 w-48" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <Skeleton className="h-5 w-40" />

        <Skeleton className="mt-8 h-12 max-w-2xl" />

        <Skeleton className="mt-5 h-5 max-w-lg" />

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div>
            <Skeleton className="h-8 w-44" />

            <Skeleton className="mt-6 h-5 w-full" />
            <Skeleton className="mt-3 h-5 w-full" />
            <Skeleton className="mt-3 h-5 w-4/5" />
            <Skeleton className="mt-3 h-5 w-full" />
          </div>

          <Skeleton className="h-[620px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function emptyToUndefined(value?: string) {
  const normalized = value?.trim();

  return normalized ? normalized : undefined;
}

function employmentTypeLabel(value: string) {
  switch (value) {
    case "FULL_TIME":
      return "Full-time";

    case "PART_TIME":
      return "Part-time";

    case "CONTRACT":
      return "Contract";

    case "TEMPORARY":
      return "Temporary";

    case "INTERNSHIP":
      return "Internship";

    default:
      return value;
  }
}

function workplaceTypeLabel(value: string) {
  switch (value) {
    case "ON_SITE":
      return "On-site";

    case "HYBRID":
      return "Hybrid";

    case "REMOTE":
      return "Remote";

    default:
      return value;
  }
}

function formatDeadline(deadline: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${deadline}T00:00:00`));
}
