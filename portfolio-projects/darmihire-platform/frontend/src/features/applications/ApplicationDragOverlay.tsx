import {
  GripVertical,
  Mail,
  MapPin,
} from "lucide-react";

import type {
  JobApplication,
} from "./types";

type ApplicationDragOverlayProps = {
  application: JobApplication;
};

export function ApplicationDragOverlay({
  application,
}: ApplicationDragOverlayProps) {
  return (
    <div className="w-[270px] rotate-1 rounded-lg border bg-background p-3 shadow-xl">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 rounded p-1 text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {
              application.candidateFullName
            }
          </p>

          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {
              application.candidateEmail
            }
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {application.candidateLocation && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />

            <span className="truncate">
              {
                application.candidateLocation
              }
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />

          <span className="truncate">
            {
              application.candidateEmail
            }
          </span>
        </div>
      </div>
    </div>
  );
}