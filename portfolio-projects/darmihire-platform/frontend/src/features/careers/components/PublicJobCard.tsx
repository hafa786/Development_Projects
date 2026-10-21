import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  MapPin,
} from "lucide-react";

import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type {
  EmploymentType,
  PublicJob,
  WorkplaceType,
} from "../types";

type PublicJobCardProps = {
  companySlug: string;
  job: PublicJob;
};

function employmentTypeLabel(
  type: EmploymentType,
) {
  switch (type) {
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
  }
}

function workplaceTypeLabel(
  type: WorkplaceType,
) {
  switch (type) {
    case "ON_SITE":
      return "On-site";

    case "HYBRID":
      return "Hybrid";

    case "REMOTE":
      return "Remote";
  }
}

function formatDeadline(
  deadline: string,
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(`${deadline}T00:00:00`),
  );
}

export function PublicJobCard({
  companySlug,
  job,
}: PublicJobCardProps) {
  return (
    <Card className="group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="font-medium"
            >
              {employmentTypeLabel(
                job.employmentType,
              )}
            </Badge>

            <Badge
              variant="outline"
              className="font-medium"
            >
              {workplaceTypeLabel(
                job.workplaceType,
              )}
            </Badge>
          </div>

          <h3 className="mt-4 text-xl font-semibold tracking-tight transition-colors group-hover:text-emerald-700">
            {job.title}
          </h3>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {job.location}
              </span>
            )}

            {job.department && (
              <span className="flex items-center gap-1.5">
                <Building2 className="size-4" />
                {job.department}
              </span>
            )}

            {job.team && (
              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness className="size-4" />
                {job.team}
              </span>
            )}

            {job.applicationDeadline && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" />

                Apply by{" "}
                {formatDeadline(
                  job.applicationDeadline,
                )}
              </span>
            )}
          </div>

          {job.openings > 1 && (
            <p className="mt-3 text-sm font-medium text-emerald-700">
              {job.openings} openings
            </p>
          )}
        </div>

        <Button
          variant="outline"
          className="shrink-0 gap-2 group-hover:border-emerald-600 group-hover:text-emerald-700"
        >
          <Link
            to={`/careers/${encodeURIComponent(
              companySlug,
            )}/jobs/${encodeURIComponent(
              job.slug,
            )}`}
          >
            View role
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}