import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CheckCircle2 } from "lucide-react";

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

import { applicationQueryKeys } from "@/features/applications/queryKeys";

import { getTenantId } from "@/utils/session";

import { completeInterview } from "./api";

import { interviewQueryKeys } from "./queryKeys";

import type { Interview } from "./types";

type CompleteInterviewDialogProps = {
    interview: Interview;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CompleteInterviewDialog({
    interview,
    open,
    onOpenChange,
}: CompleteInterviewDialogProps) {
    const tenantId = getTenantId();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => completeInterview(interview.id),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: interviewQueryKeys.application(tenantId, interview.applicationId),
                }),

                queryClient.invalidateQueries({
                    queryKey: interviewQueryKeys.detail(tenantId, interview.id),
                }),

                queryClient.invalidateQueries({
                    queryKey: interviewQueryKeys.list(tenantId),
                }),

                queryClient.invalidateQueries({
                    queryKey: applicationQueryKeys.activities(tenantId, interview.applicationId),
                }),
            ]);

            toast.success("Interview completed");

            onOpenChange(false);
        },

        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to complete interview");
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle2 className="size-5" />
                        Complete interview
                    </DialogTitle>

                    <DialogDescription>Mark {interview.title} as completed?</DialogDescription>
                </DialogHeader>

                <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="text-sm">Once completed, the interview becomes read-only.</p>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        disabled={mutation.isPending}
                        onClick={() => mutation.mutate()}
                    >
                        <CheckCircle2 className="mr-2 size-4" />

                        {mutation.isPending ? "Completing..." : "Mark completed"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
