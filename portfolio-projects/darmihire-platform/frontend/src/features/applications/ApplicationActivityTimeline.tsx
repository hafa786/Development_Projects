import {
  Ban,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  CircleUserRound,
  MoveRight,
  UserCheck,
  UserMinus,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

import type {
  ApplicationActivity,
  ApplicationActivityType,
  ApplicationStage,
} from "./types";

type ApplicationActivityTimelineProps = {
  activities: ApplicationActivity[];
};

const stageLabels: Record<
  ApplicationStage,
  string
> = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  HIRED: "Hired",
};

const activityLabels: Record<
  ApplicationActivityType,
  string
> = {
  APPLICATION_CREATED:
    "Application created",

  STAGE_CHANGED:
    "Stage changed",

  REJECTED:
    "Application rejected",

  WITHDRAWN:
    "Application withdrawn",

  HIRED:
    "Candidate hired",

  INTERVIEW_SCHEDULED:
    "Interview scheduled",

  INTERVIEW_RESCHEDULED:
    "Interview rescheduled",

  INTERVIEW_CANCELLED:
    "Interview cancelled",

  INTERVIEW_COMPLETED:
    "Interview completed",

  INTERVIEWER_ADDED:
    "Interviewer assigned",

  INTERVIEWER_REMOVED:
    "Interviewer removed",
};

function ActivityIcon({
  type,
}: {
  type: ApplicationActivityType;
}) {
  const className = "size-4";

  switch (type) {
    case "APPLICATION_CREATED":
      return (
        <CircleUserRound
          className={className}
        />
      );

    case "STAGE_CHANGED":
      return (
        <MoveRight
          className={className}
        />
      );

    case "REJECTED":
      return (
        <XCircle
          className={className}
        />
      );

    case "WITHDRAWN":
      return (
        <Ban
          className={className}
        />
      );

    case "HIRED":
      return (
        <UserRoundCheck
          className={className}
        />
      );

    case "INTERVIEW_SCHEDULED":
      return (
        <CalendarPlus
          className={className}
        />
      );

    case "INTERVIEW_RESCHEDULED":
      return (
        <CalendarClock
          className={className}
        />
      );

    case "INTERVIEW_CANCELLED":
      return (
        <Ban
          className={className}
        />
      );

    case "INTERVIEW_COMPLETED":
      return (
        <CheckCircle2
          className={className}
        />
      );

    case "INTERVIEWER_ADDED":
      return (
        <UserCheck
          className={className}
        />
      );

    case "INTERVIEWER_REMOVED":
      return (
        <UserMinus
          className={className}
        />
      );

    default:
      return (
        <CircleUserRound
          className={className}
        />
      );
  }
}

function formatDateTime(
  value: string,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

export function ApplicationActivityTimeline({
  activities,
}: ApplicationActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-6 py-10 text-center">
        <p className="text-sm font-medium">
          No activity yet
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Application and interview
          activity will appear here.
        </p>
      </div>
    );
  }

  const orderedActivities = [
    ...activities,
  ].sort(
    (a, b) =>
      new Date(
        b.createdAt,
      ).getTime() -
      new Date(
        a.createdAt,
      ).getTime(),
  );

  return (
    <div className="space-y-0">
      {orderedActivities.map(
        (activity, index) => {
          const isLast =
            index ===
            orderedActivities.length -
              1;

          return (
            <div
              key={activity.id}
              className="relative flex gap-4"
            >
              {!isLast ? (
                <div className="absolute bottom-0 left-4 top-8 w-px bg-border" />
              ) : null}

              <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
                <ActivityIcon
                  type={
                    activity.activityType
                  }
                />
              </div>

              <div className="min-w-0 flex-1 pb-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {
                        activityLabels[
                          activity
                            .activityType
                        ]
                      }
                    </p>

                    {activity.description ? (
                      <p className="mt-1 break-words text-sm text-muted-foreground">
                        {
                          activity.description
                        }
                      </p>
                    ) : null}

                    {activity.activityType ===
                      "STAGE_CHANGED" &&
                    activity.fromStage &&
                    activity.toStage ? (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-md bg-muted px-2 py-1">
                          {
                            stageLabels[
                              activity
                                .fromStage
                            ]
                          }
                        </span>

                        <MoveRight className="size-3 text-muted-foreground" />

                        <span className="rounded-md bg-muted px-2 py-1">
                          {
                            stageLabels[
                              activity
                                .toStage
                            ]
                          }
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <time className="shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(
                      activity.createdAt,
                    )}
                  </time>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {activity.performedByName
                    ? `By ${activity.performedByName}`
                    : "System"}
                </p>
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}