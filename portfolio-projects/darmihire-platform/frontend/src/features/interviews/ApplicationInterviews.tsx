import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import {
  CalendarPlus,
  CalendarX2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getTenantId } from "@/utils/session";

import { getApplicationInterviews } from "./api";
import { InterviewCard } from "./InterviewCard";
import { interviewQueryKeys } from "./queryKeys";
import { ScheduleInterviewDialog } from "./ScheduleInterviewDialog";

type ApplicationInterviewsProps = {
  applicationId: string;
  candidateName?: string;
  jobTitle?: string;
};

export function ApplicationInterviews({
  applicationId,
  candidateName,
  jobTitle,
}: ApplicationInterviewsProps) {
  const tenantId = getTenantId();

  const [scheduleOpen, setScheduleOpen] =
    useState(false);

  const interviewsQuery = useQuery({
    queryKey: interviewQueryKeys.application(
      tenantId,
      applicationId,
    ),

    queryFn: () =>
      getApplicationInterviews(applicationId),

    enabled: Boolean(
      tenantId && applicationId,
    ),
  });

  const interviews =
    interviewsQuery.data ?? [];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>
                Interviews
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Schedule and review interviews for this application.
              </p>
            </div>

            <Button
              onClick={() =>
                setScheduleOpen(true)
              }
            >
              <CalendarPlus className="mr-2 size-4" />
              Schedule interview
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {interviewsQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : interviewsQuery.isError ? (
            <div className="rounded-lg border border-destructive/50 p-5">
              <p className="font-medium">
                Unable to load interviews
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please try again.
              </p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center">
              <CalendarX2 className="size-9 text-muted-foreground" />

              <h3 className="mt-4 font-medium">
                No interviews scheduled
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Schedule the first interview for this candidate application.
              </p>

              <Button
                className="mt-4"
                onClick={() =>
                  setScheduleOpen(true)
                }
              >
                <CalendarPlus className="mr-2 size-4" />
                Schedule interview
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {interviews.map(
                (interview) => (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                  />
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ScheduleInterviewDialog
        applicationId={applicationId}
        candidateName={candidateName}
        jobTitle={jobTitle}
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        showTrigger={false}
      />
    </>
  );
}