import {
  useEffect,
  useState,
} from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Ban } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Textarea,
} from "@/components/ui/textarea";

import {
  applicationQueryKeys,
} from "@/features/applications/queryKeys";

import { getTenantId } from "@/utils/session";

import {
  cancelInterview,
} from "./api";

import {
  interviewQueryKeys,
} from "./queryKeys";

import type {
  Interview,
} from "./types";

type CancelInterviewDialogProps = {
  interview: Interview;
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
};

export function CancelInterviewDialog({
  interview,
  open,
  onOpenChange,
}: CancelInterviewDialogProps) {
  const tenantId = getTenantId();

  const queryClient =
    useQueryClient();

  const [reason, setReason] =
    useState("");

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReason("");
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: () =>
      cancelInterview(
        interview.id,
        {
          reason:
            reason.trim() ||
            null,
        },
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            interviewQueryKeys.application(
              tenantId,
              interview.applicationId,
            ),
        }),

        queryClient.invalidateQueries({
          queryKey:
            interviewQueryKeys.detail(
              tenantId,
              interview.id,
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
              interview.applicationId,
            ),
        }),
      ]);

      toast.success(
        "Interview cancelled",
      );

      onOpenChange(false);
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to cancel interview",
      );
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!mutation.isPending) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="size-5" />
            Cancel interview
          </DialogTitle>

          <DialogDescription>
            Cancel{" "}
            {interview.title}.
            The interview will remain in
            the application history.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={reason}
          disabled={
            mutation.isPending
          }
          onChange={(event) =>
            setReason(
              event.target.value,
            )
          }
          placeholder="Optional cancellation reason..."
          className="min-h-28"
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Keep interview
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={
              mutation.isPending
            }
            onClick={() =>
              mutation.mutate()
            }
          >
            {mutation.isPending
              ? "Cancelling..."
              : "Cancel interview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}