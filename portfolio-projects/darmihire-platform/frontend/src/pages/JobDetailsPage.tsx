import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  User,
  Users,
} from "lucide-react";

import { getJob } from "@/features/jobs/api";
import { jobQueryKeys } from "@/features/jobs/queryKeys";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatEnum = (value?: string | null) => {
  if (!value) return "—";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: jobQueryKeys.detail(jobId ?? ""),
    queryFn: () => getJob(jobId!),
    enabled: Boolean(jobId),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading job...</p>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="space-y-4 p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/jobs")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs
        </Button>

        <Card>
          <CardContent className="py-10 text-center">
            <h2 className="text-lg font-semibold">
              Job not found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              The job could not be loaded.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => navigate("/jobs")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to jobs
      </Button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline">
              {formatEnum(job.status)}
            </Badge>

            <span className="text-sm text-muted-foreground">
              {job.jobCode}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            {job.title}
          </h1>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {job.departmentName ?? "No department"}
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {job.locationName ?? "No location"}
            </span>

            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              {formatEnum(job.employmentType)}
            </span>
          </div>
        </div>

        <Button onClick={() => navigate("/jobs")}>
          Edit job
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job overview</CardTitle>
          </CardHeader>

          <CardContent>
            {job.description ? (
              <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {job.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No job description has been added.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Detail
                label="Status"
                value={formatEnum(job.status)}
              />

              <Detail
                label="Employment type"
                value={formatEnum(job.employmentType)}
              />

              <Detail
                label="Workplace"
                value={formatEnum(job.workplaceType)}
              />

              <Detail
                label="Openings"
                value={String(job.openings)}
              />

              <Detail
                label="Department"
                value={job.departmentName}
              />

              <Detail
                label="Team"
                value={job.teamName}
              />

              <Detail
                label="Location"
                value={job.locationName}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hiring team</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Recruiter
                  </p>

                  <p className="text-sm font-medium">
                    {job.recruiterName ?? "Not assigned"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <Users className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Hiring manager
                  </p>

                  <p className="text-sm font-medium">
                    {job.hiringManagerName ?? "Not assigned"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-right text-sm font-medium">
        {value || "—"}
      </span>
    </div>
  );
}