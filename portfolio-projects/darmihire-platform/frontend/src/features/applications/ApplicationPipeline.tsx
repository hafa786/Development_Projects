import {
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  Search,
  Trophy,
} from "lucide-react";

import { ApplicationCard } from "./ApplicationCard";

import type {
  ApplicationStage,
  JobApplication,
} from "./types";

type ApplicationPipelineProps = {
  applications: JobApplication[];

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

const columns: {
  stage: ApplicationStage;
  label: string;
  icon: typeof ClipboardList;
}[] = [
  {
    stage: "APPLIED",
    label: "Applied",
    icon: ClipboardList,
  },
  {
    stage: "SCREENING",
    label: "Screening",
    icon: Search,
  },
  {
    stage: "INTERVIEW",
    label: "Interview",
    icon: MessageSquare,
  },
  {
    stage: "OFFER",
    label: "Offer",
    icon: CheckCircle2,
  },
  {
    stage: "HIRED",
    label: "Hired",
    icon: Trophy,
  },
];

export function ApplicationPipeline({
  applications,
  onMove,
  onReject,
  onWithdraw,
}: ApplicationPipelineProps) {
  const visibleApplications =
    applications.filter(
      (application) =>
        application.status === "ACTIVE" ||
        application.status === "HIRED",
    );

  return (
    <div className="overflow-x-auto pb-4">
      <div className="grid min-w-[1250px] grid-cols-5 gap-4">
        {columns.map((column) => {
          const columnApplications =
            visibleApplications.filter(
              (application) =>
                application.stage ===
                column.stage,
            );

          const Icon = column.icon;

          return (
            <div
              key={column.stage}
              className="rounded-xl bg-muted/40 p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />

                  <h3 className="text-sm font-semibold">
                    {column.label}
                  </h3>
                </div>

                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-background px-2 text-xs font-medium">
                  {
                    columnApplications.length
                  }
                </span>
              </div>

              <div className="space-y-3">
                {columnApplications.map(
                  (application) => (
                    <ApplicationCard
                      key={application.id}
                      application={
                        application
                      }
                      onMove={onMove}
                      onReject={onReject}
                      onWithdraw={
                        onWithdraw
                      }
                    />
                  ),
                )}

                {columnApplications.length ===
                  0 && (
                  <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}