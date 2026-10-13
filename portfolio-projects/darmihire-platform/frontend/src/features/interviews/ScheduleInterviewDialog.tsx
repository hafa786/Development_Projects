import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { getTenantId } from "@/utils/session";

import { createInterview } from "./api";
import { localDateTimeToIso } from "./dateTime";
import { InterviewForm } from "./InterviewForm";
import { interviewQueryKeys } from "./queryKeys";
import type { InterviewFormValues } from "./schemas";

type ScheduleInterviewDialogProps = {
  applicationId: string;
  candidateName?: string;
  jobTitle?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  const queryClient = useQueryClient();

  const tenantId = getTenantId();

  const mutation = useMutation({
    mutationFn: (values: InterviewFormValues) =>
      createInterview({
        applicationId,

        title: values.title,

        interviewType: values.interviewType,

        startTime: localDateTimeToIso(
          values.date,
          values.startTime,
        ),

        endTime: localDateTimeToIso(
          values.date,
          values.endTime,
        ),

        timezone: values.timezone,

        location: values.location?.trim() || null,

        meetingUrl:
          values.meetingUrl?.trim() || null,

        notes: values.notes?.trim() || null,

        interviewerIds: [],
      }),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: interviewQueryKeys.application(
            tenantId,
            applicationId,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: interviewQueryKeys.list(
            tenantId,
          ),
        }),
      ]);

      toast.success("Interview scheduled");

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
      onOpenChange={onOpenChange}
    >
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button>
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
            {candidateName && jobTitle
              ? `Schedule an interview with ${candidateName} for ${jobTitle}.`
              : "Choose the interview type, date, time and meeting details."}
          </DialogDescription>
        </DialogHeader>

        <InterviewForm
          isPending={mutation.isPending}
          onCancel={() =>
            onOpenChange?.(false)
          }
          onSubmit={(values) =>
            mutation.mutate(values)
          }
        />
      </DialogContent>
    </Dialog>
  );
}