import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { getDepartments } from "@/features/departments/api";
import { departmentQueryKeys } from "@/features/departments/queryKeys";

import { getTeams } from "@/features/teams/api";
import { teamQueryKeys } from "@/features/teams/queryKeys";

import { getLocations } from "@/features/locations/api";
import { locationQueryKeys } from "@/features/locations/queryKeys";

import { getMembers } from "@/features/members/api";
import { memberQueryKeys } from "@/features/members/queryKeys";

import { getTenantId } from "@/utils/session";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  jobFormSchema,
  type JobFormValues,
} from "./schemas";

import type { Job } from "./types";

type JobFormProps = {
  job?: Job | null;
  submitting?: boolean;
  onSubmit: (values: JobFormValues) => void;
};

const NONE_VALUE = "__none__";

export function JobForm({
  job,
  submitting = false,
  onSubmit,
}: JobFormProps) {
  const tenantId = getTenantId();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),

    defaultValues: {
      title: job?.title ?? "",
      jobCode: job?.jobCode ?? "",
      description: job?.description ?? "",

      departmentId: job?.departmentId ?? "",
      teamId: job?.teamId ?? "",
      locationId: job?.locationId ?? "",

      recruiterId: job?.recruiterId ?? "",
      hiringManagerId: job?.hiringManagerId ?? "",

      employmentType:
        job?.employmentType ?? "FULL_TIME",

      workplaceType:
        job?.workplaceType ?? "HYBRID",

      openings: job?.openings ?? 1,
    },
  });

  const departmentsQuery = useQuery({
    queryKey: departmentQueryKeys.list(tenantId),
    queryFn: getDepartments,
    enabled: Boolean(tenantId),
  });

  const teamsQuery = useQuery({
    queryKey: teamQueryKeys.list(tenantId),
    queryFn: getTeams,
    enabled: Boolean(tenantId),
  });

  const locationsQuery = useQuery({
    queryKey: locationQueryKeys.list(tenantId),
    queryFn: getLocations,
    enabled: Boolean(tenantId),
  });

  const membersQuery = useQuery({
    queryKey: memberQueryKeys.list(tenantId),
    queryFn: getMembers,
    enabled: Boolean(tenantId),
  });

  const activeMembers =
    membersQuery.data?.filter(
      (member) => member.status === "ACTIVE",
    ) ?? [];

  const departmentId = watch("departmentId");
  const teamId = watch("teamId");
  const locationId = watch("locationId");
  const recruiterId = watch("recruiterId");
  const hiringManagerId = watch("hiringManagerId");
  const employmentType = watch("employmentType");
  const workplaceType = watch("workplaceType");

  function getOptionalSelectValue(value?: string) {
    return value || NONE_VALUE;
  }

  function setOptionalValue(
    field:
      | "departmentId"
      | "teamId"
      | "locationId"
      | "recruiterId"
      | "hiringManagerId",
    value: string,
  ) {
    setValue(
      field,
      value === NONE_VALUE ? "" : value,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Job title + code */}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">
            Job title
          </Label>

          <Input
            id="title"
            placeholder="Senior Backend Engineer"
            {...register("title")}
          />

          {errors.title && (
            <p className="text-sm text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>

        {!job && (
          <div className="space-y-2">
            <Label htmlFor="jobCode">
              Job code
            </Label>

            <Input
              id="jobCode"
              placeholder="Auto-generated if empty"
              {...register("jobCode")}
            />

            {errors.jobCode && (
              <p className="text-sm text-destructive">
                {errors.jobCode.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Description */}

      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          rows={7}
          placeholder="Describe the role, responsibilities and requirements..."
          {...register("description")}
        />

        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Department / Team */}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Department</Label>

          <Select
            value={getOptionalSelectValue(
              departmentId,
            )}
            onValueChange={(value) =>
              setOptionalValue(
                "departmentId",
                value,
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={NONE_VALUE}>
                No department
              </SelectItem>

              {departmentsQuery.data?.map(
                (department) => (
                  <SelectItem
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          {errors.departmentId && (
            <p className="text-sm text-destructive">
              {errors.departmentId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Team</Label>

          <Select
            value={getOptionalSelectValue(
              teamId,
            )}
            onValueChange={(value) =>
              setOptionalValue(
                "teamId",
                value,
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={NONE_VALUE}>
                No team
              </SelectItem>

              {teamsQuery.data?.map((team) => (
                <SelectItem
                  key={team.id}
                  value={team.id}
                >
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.teamId && (
            <p className="text-sm text-destructive">
              {errors.teamId.message}
            </p>
          )}
        </div>
      </div>

      {/* Location / Openings */}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Location</Label>

          <Select
            value={getOptionalSelectValue(
              locationId,
            )}
            onValueChange={(value) =>
              setOptionalValue(
                "locationId",
                value,
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={NONE_VALUE}>
                No location
              </SelectItem>

              {locationsQuery.data?.map(
                (location) => (
                  <SelectItem
                    key={location.id}
                    value={location.id}
                  >
                    {location.name}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          {errors.locationId && (
            <p className="text-sm text-destructive">
              {errors.locationId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="openings">
            Number of openings
          </Label>

          <Input
            id="openings"
            type="number"
            min={1}
            {...register("openings", {
              valueAsNumber: true,
            })}
          />

          {errors.openings && (
            <p className="text-sm text-destructive">
              {errors.openings.message}
            </p>
          )}
        </div>
      </div>

      {/* Employment / Workplace */}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Employment type</Label>

          <Select
            value={employmentType}
            onValueChange={(value) =>
              setValue(
                "employmentType",
                value as JobFormValues["employmentType"],
                {
                  shouldValidate: true,
                  shouldDirty: true,
                },
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="FULL_TIME">
                Full time
              </SelectItem>

              <SelectItem value="PART_TIME">
                Part time
              </SelectItem>

              <SelectItem value="CONTRACT">
                Contract
              </SelectItem>

              <SelectItem value="TEMPORARY">
                Temporary
              </SelectItem>

              <SelectItem value="INTERNSHIP">
                Internship
              </SelectItem>
            </SelectContent>
          </Select>

          {errors.employmentType && (
            <p className="text-sm text-destructive">
              {errors.employmentType.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Workplace type</Label>

          <Select
            value={workplaceType}
            onValueChange={(value) =>
              setValue(
                "workplaceType",
                value as JobFormValues["workplaceType"],
                {
                  shouldValidate: true,
                  shouldDirty: true,
                },
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ON_SITE">
                On-site
              </SelectItem>

              <SelectItem value="HYBRID">
                Hybrid
              </SelectItem>

              <SelectItem value="REMOTE">
                Remote
              </SelectItem>
            </SelectContent>
          </Select>

          {errors.workplaceType && (
            <p className="text-sm text-destructive">
              {errors.workplaceType.message}
            </p>
          )}
        </div>
      </div>

      {/* Recruiter / Hiring Manager */}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Recruiter</Label>

          <Select
            value={getOptionalSelectValue(
              recruiterId,
            )}
            onValueChange={(value) =>
              setOptionalValue(
                "recruiterId",
                value,
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select recruiter" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={NONE_VALUE}>
                Unassigned
              </SelectItem>

              {activeMembers.map((member) => (
                <SelectItem
                  key={member.tenantUserId}
                  value={member.tenantUserId}
                >
                  {member.firstName}{" "}
                  {member.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.recruiterId && (
            <p className="text-sm text-destructive">
              {errors.recruiterId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Hiring manager</Label>

          <Select
            value={getOptionalSelectValue(
              hiringManagerId,
            )}
            onValueChange={(value) =>
              setOptionalValue(
                "hiringManagerId",
                value,
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select hiring manager" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={NONE_VALUE}>
                Unassigned
              </SelectItem>

              {activeMembers.map((member) => (
                <SelectItem
                  key={member.tenantUserId}
                  value={member.tenantUserId}
                >
                  {member.firstName}{" "}
                  {member.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.hiringManagerId && (
            <p className="text-sm text-destructive">
              {errors.hiringManagerId.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Saving..."
            : job
              ? "Save changes"
              : "Create job"}
        </Button>
      </div>
    </form>
  );
}