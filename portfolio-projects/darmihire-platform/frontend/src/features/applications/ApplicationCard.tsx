import {
  ChevronRight,
  MapPin,
  MoreHorizontal,
  UserRound,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {
  ApplicationStage,
  JobApplication,
} from "./types";

type ApplicationCardProps = {
  application: JobApplication;

  onMove: (
    application: JobApplication,
    stage: ApplicationStage,
  ) => void;

  onReject: (
    application: JobApplication,
  ) => void;

  onWithdraw: (
    application: JobApplication,
  ) => void;
};

const stages: ApplicationStage[] = [
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
];

export function ApplicationCard({
  application,
  onMove,
  onReject,
  onWithdraw,
}: ApplicationCardProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() =>
            navigate(
              `/candidates/${application.candidateId}`,
            )
          }
          className="min-w-0 text-left"
        >
          <p className="truncate font-medium hover:underline">
            {application.candidateFullName}
          </p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {application.candidateEmail}
          </p>
        </button>

        {application.status === "ACTIVE" && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-52"
            >
                Application
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() =>
                  navigate(
                    `/candidates/${application.candidateId}`,
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <UserRound className="mr-2 h-4 w-4" />
                View candidate
              </DropdownMenuItem>

              {stages
                .filter(
                  (stage) =>
                    stage !==
                    application.stage,
                )
                .map((stage) => (
                  <DropdownMenuItem
                    key={stage}
                    onSelect={() =>
                      onMove(
                        application,
                        stage,
                      )
                    }
                    onClick={() => onMove(application, stage)}
                    style={{ cursor: "pointer" }}
                  >
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Move to{" "}
                    {stageLabel(stage)}
                  </DropdownMenuItem>
                ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() =>
                  onReject(application)
                }
                onClick={() => onReject(application)}
                style={{ cursor: "pointer" }}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() =>
                  onWithdraw(application)
                }
                onClick={() => onWithdraw(application)}
                style={{ cursor: "pointer" }}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Withdraw
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {application.candidateLocation && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {application.candidateLocation}
        </div>
      )}

      <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">
        Applied{" "}
        {formatDate(application.appliedAt)}
      </div>
    </div>
  );
}

function stageLabel(
  stage: ApplicationStage,
) {
  const labels: Record<
    ApplicationStage,
    string
  > = {
    APPLIED: "Applied",
    SCREENING: "Screening",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    HIRED: "Hired",
  };

  return labels[stage];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      day: "numeric",
      month: "short",
    },
  ).format(new Date(value));
}