import {
  CalendarDays,
  Clock3,
  MapPin,
  Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { formatInterviewDateTime } from "./dateTime";
import type {
  Interview,
  InterviewStatus,
  InterviewType,
} from "./types";

type InterviewCardProps = {
  interview: Interview;
};

const typeLabels: Record<InterviewType, string> = {
  PHONE_SCREEN: "Phone screen",
  VIDEO_INTERVIEW: "Video interview",
  TECHNICAL_INTERVIEW: "Technical interview",
  BEHAVIORAL_INTERVIEW: "Behavioral interview",
  HR_INTERVIEW: "HR interview",
  HIRING_MANAGER_INTERVIEW:
    "Hiring manager interview",
  PANEL_INTERVIEW: "Panel interview",
  FINAL_INTERVIEW: "Final interview",
  OTHER: "Other",
};

const statusLabels: Record<InterviewStatus, string> = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function InterviewCard({
  interview,
}: InterviewCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">
              {interview.title}
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              {typeLabels[interview.interviewType]}
            </p>
          </div>

          <Badge
            variant={
              interview.status === "CANCELLED"
                ? "destructive"
                : interview.status === "COMPLETED"
                  ? "secondary"
                  : "default"
            }
          >
            {statusLabels[interview.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />

          <span>
            {formatInterviewDateTime(
              interview.startTime,
              interview.timezone,
            )}
          </span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <Clock3 className="mt-0.5 size-4 text-muted-foreground" />

          <span>
            Until{" "}
            {formatInterviewDateTime(
              interview.endTime,
              interview.timezone,
            )}
          </span>
        </div>

        {interview.location ? (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 text-muted-foreground" />

            <span>{interview.location}</span>
          </div>
        ) : null}

        {interview.meetingUrl ? (
          <div className="flex items-start gap-2 text-sm">
            <Video className="mt-0.5 size-4 text-muted-foreground" />

            <a
              href={interview.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all text-primary underline-offset-4 hover:underline"
            >
              Join meeting
            </a>
          </div>
        ) : null}

        {interview.notes ? (
          <p className="border-t pt-3 text-sm text-muted-foreground">
            {interview.notes}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}