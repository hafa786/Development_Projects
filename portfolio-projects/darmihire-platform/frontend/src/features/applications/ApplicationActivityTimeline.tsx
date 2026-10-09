import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Circle,
  Clock3,
  Trophy,
  UserRound,
  UserX,
  XCircle,
} from "lucide-react";

import type {
  ApplicationActivity,
  ApplicationActivityType,
} from "./types";

type ApplicationActivityTimelineProps = {
  activities: ApplicationActivity[];
};

export function ApplicationActivityTimeline({
  activities,
}: ApplicationActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Clock3 className="h-5 w-5 text-muted-foreground" />
        </div>

        <p className="mt-4 font-medium">
          No activity yet
        </p>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Recruitment activity for this
          application will appear here.
        </p>
      </div>
    );
  }

  /*
   * Backend currently returns ASC.
   *
   * For recruiter-facing UI, showing the
   * newest activity first is generally
   * more useful.
   */
  const sortedActivities = [
    ...activities,
  ].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  );

  return (
    <div className="relative">
      {sortedActivities.map(
        (activity, index) => {
          const isLast =
            index ===
            sortedActivities.length - 1;

          return (
            <ActivityItem
              key={activity.id}
              activity={activity}
              showLine={!isLast}
            />
          );
        },
      )}
    </div>
  );
}

function ActivityItem({
  activity,
  showLine,
}: {
  activity: ApplicationActivity;
  showLine: boolean;
}) {
  const config =
    getActivityConfig(
      activity.activityType,
    );

  const Icon = config.icon;

  return (
    <div className="relative flex gap-4 pb-7">
      {/* Timeline */}

      <div className="relative flex w-9 shrink-0 justify-center">
        {showLine && (
          <div className="absolute bottom-[-4px] top-9 w-px bg-border" />
        )}

        <div
          className={[
            "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border",
            config.className,
          ].join(" ")}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Content */}

      <div className="min-w-0 flex-1 pt-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-medium">
              {getActivityTitle(
                activity,
              )}
            </p>

            {shouldShowDescription(
              activity,
            ) &&
              activity.description && (
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {activity.description}
                </p>
              )}
          </div>

          <time
            dateTime={activity.createdAt}
            className="shrink-0 text-xs text-muted-foreground"
            title={formatFullDate(
              activity.createdAt,
            )}
          >
            {formatRelativeDate(
              activity.createdAt,
            )}
          </time>
        </div>

        {activity.activityType ===
          "STAGE_CHANGED" &&
          activity.fromStage &&
          activity.toStage && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StagePill
                stage={
                  activity.fromStage
                }
              />

              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />

              <StagePill
                stage={activity.toStage}
              />
            </div>
          )}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {activity.performedByName ? (
            <span className="flex items-center gap-1">
              <UserRound className="h-3 w-3" />

              {
                activity.performedByName
              }
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <BriefcaseBusiness className="h-3 w-3" />
              System
            </span>
          )}

          <span>
            {formatFullDate(
              activity.createdAt,
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function StagePill({
  stage,
}: {
  stage: string;
}) {
  return (
    <span className="rounded-full border bg-muted/40 px-2.5 py-1 text-xs font-medium">
      {formatEnum(stage)}
    </span>
  );
}

function getActivityTitle(
  activity: ApplicationActivity,
) {
  switch (activity.activityType) {
    case "APPLICATION_CREATED":
      return "Application created";

    case "STAGE_CHANGED":
      if (
        activity.fromStage &&
        activity.toStage
      ) {
        return `Moved from ${formatEnum(
          activity.fromStage,
        )} to ${formatEnum(
          activity.toStage,
        )}`;
      }

      return "Application stage changed";

    case "REJECTED":
      return "Application rejected";

    case "WITHDRAWN":
      return "Application withdrawn";

    case "HIRED":
      return "Candidate hired";

    default:
      return "Application updated";
  }
}

function shouldShowDescription(
  activity: ApplicationActivity,
) {
  if (!activity.description) {
    return false;
  }

  /*
   * Avoid displaying duplicate text such as:
   *
   * Application created
   * Application created
   */

  if (
    activity.activityType ===
      "APPLICATION_CREATED" &&
    activity.description ===
      "Application created"
  ) {
    return false;
  }

  if (
    activity.activityType ===
      "HIRED" &&
    activity.description ===
      "Candidate hired"
  ) {
    return false;
  }

  if (
    activity.activityType ===
      "STAGE_CHANGED" &&
    activity.fromStage &&
    activity.toStage
  ) {
    return false;
  }

  return true;
}

function getActivityConfig(
  type: ApplicationActivityType,
) {
  switch (type) {
    case "APPLICATION_CREATED":
      return {
        icon: Circle,
        className:
          "bg-background text-muted-foreground",
      };

    case "STAGE_CHANGED":
      return {
        icon: ArrowRight,
        className:
          "bg-primary/10 text-primary border-primary/20",
      };

    case "HIRED":
      return {
        icon: Trophy,
        className:
          "bg-primary/10 text-primary border-primary/20",
      };

    case "REJECTED":
      return {
        icon: XCircle,
        className:
          "bg-destructive/10 text-destructive border-destructive/20",
      };

    case "WITHDRAWN":
      return {
        icon: UserX,
        className:
          "bg-muted text-muted-foreground",
      };

    default:
      return {
        icon: CheckCircle2,
        className:
          "bg-muted text-muted-foreground",
      };
  }
}

function formatEnum(
  value: string,
) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function formatFullDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(value));
}

function formatRelativeDate(
  value: string,
) {
  const date = new Date(value);
  const now = new Date();

  const difference =
    now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (difference < minute) {
    return "Just now";
  }

  if (difference < hour) {
    const minutes = Math.floor(
      difference / minute,
    );

    return `${minutes}m ago`;
  }

  if (difference < day) {
    const hours = Math.floor(
      difference / hour,
    );

    return `${hours}h ago`;
  }

  if (difference < 7 * day) {
    const days = Math.floor(
      difference / day,
    );

    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      day: "numeric",
      month: "short",
    },
  ).format(date);
}