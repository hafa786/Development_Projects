import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  CalendarPlus,
} from "lucide-react";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  applicationQueryKeys,
} from "@/features/applications/queryKeys";

import { getTenantId } from "@/utils/session";

import { createInterview } from "./api";
import {
  localDateTimeToIso,
} from "./dateTime";
import { InterviewForm } from "./InterviewForm";
import { interviewQueryKeys } from "./queryKeys";

import type {
  InterviewFormValues,
} from "./schemas";

type ScheduleInterviewDialogProps = {
  applicationId: string;

  candidateName?: string;

  jobTitle?: string;

  open?: boolean;

  onOpenChange?: (
    open: boolean,
  ) => void;

  showTrigger?: boolean;
};

export function ScheduleInterviewDialog({
  applicationId,
  candidateName,
  jobTitle,
  open,
  onOpenChange,
  showTrigger = true,
}: ScheduleInterviewDialogProps) {
  const tenantId = getTenantId();

  const queryClient =
    useQueryClient();

  const mutation = useMutation({
    mutationFn: (
      values: InterviewFormValues,
    ) =>
      createInterview({
        applicationId,

        title:
          values.title.trim(),

        interviewType:
          values.interviewType,

        startTime:
          localDateTimeToIso(
            values.date,
            values.startTime,
          ),

        endTime:
          localDateTimeToIso(
            values.date,
            values.endTime,
          ),

        timezone:
          values.timezone.trim(),

        location:
          values.location?.trim() ||
          null,

        meetingUrl:
          values.meetingUrl?.trim() ||
          null,

        notes:
          values.notes?.trim() ||
          null,

        interviewerIds: [],
      }),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            interviewQueryKeys.application(
              tenantId,
              applicationId,
            ),
        }),

        queryClient.invalidateQueries({
          queryKey:
            interviewQueryKeys.list(
              tenantId,
            ),
        }),

        queryClient.invalidateQueries({
          queryKey:
            applicationQueryKeys.activities(
              tenantId,
              applicationId,
            ),
        }),
      ]);

      toast.success(
        "Interview scheduled",
      );

      onOpenChange?.(false);
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to schedule interview",
      );
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!mutation.isPending) {
          onOpenChange?.(value);
        }
      }}
    >
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button type="button">
            <CalendarPlus className="mr-2 size-4" />
            Schedule interview
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Schedule interview
          </DialogTitle>

          <DialogDescription>
            {candidateName
              ? `Schedule an interview with ${candidateName}`
              : "Schedule a new interview"}

            {jobTitle
              ? ` for ${jobTitle}.`
              : "."}
          </DialogDescription>
        </DialogHeader>

        <InterviewForm
          isPending={
            mutation.isPending
          }
          submitLabel="Schedule interview"
          onSubmit={(values) =>
            mutation.mutate(values)
          }
          onCancel={() =>
            onOpenChange?.(false)
          }
        />
      </DialogContent>
    </Dialog>
  );
}