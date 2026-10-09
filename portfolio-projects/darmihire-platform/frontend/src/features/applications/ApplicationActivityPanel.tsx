import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  History,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getTenantId } from "@/utils/session";

import { getApplicationActivities } from "./api";
import { applicationQueryKeys } from "./queryKeys";
import { ApplicationActivityTimeline } from "./ApplicationActivityTimeline";

type ApplicationActivityPanelProps = {
  applicationId: string;
};

export function ApplicationActivityPanel({
  applicationId,
}: ApplicationActivityPanelProps) {
  const tenantId = getTenantId();

  const activitiesQuery = useQuery({
    queryKey:
      applicationQueryKeys.activities(
        tenantId,
        applicationId,
      ),

    queryFn: () =>
      getApplicationActivities(
        applicationId,
      ),

    enabled:
      Boolean(tenantId) &&
      Boolean(applicationId),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />

          <CardTitle className="text-lg">
            Application activity
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        {activitiesQuery.isLoading ? (
          <ActivityLoadingState />
        ) : activitiesQuery.isError ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />

            <p className="mt-3 font-medium">
              Unable to load activity
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              The application history
              could not be loaded.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() =>
                activitiesQuery.refetch()
              }
            >
              Try again
            </Button>
          </div>
        ) : (
          <ApplicationActivityTimeline
            activities={
              activitiesQuery.data ?? []
            }
          />
        )}
      </CardContent>
    </Card>
  );
}

function ActivityLoadingState() {
  return (
    <div className="space-y-6 py-2">
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4"
        >
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-muted" />

          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-44 animate-pulse rounded bg-muted" />

            <div className="h-3 w-64 max-w-full animate-pulse rounded bg-muted" />

            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}