import { useEffect, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CalendarClock } from "lucide-react";

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

import { Input } from "@/components/ui/input";

import { applicationQueryKeys } from "@/features/applications/queryKeys";

import { getTenantId } from "@/utils/session";

import { rescheduleInterview } from "./api";

import { localDateTimeToIso } from "./dateTime";

import { interviewQueryKeys } from "./queryKeys";

import type { Interview } from "./types";

type RescheduleInterviewDialogProps = {
    interview: Interview;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

function toDateInputValue(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function toTimeInputValue(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const hours = String(date.getHours()).padStart(2, "0");

    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}

export function RescheduleInterviewDialog({
    interview,
    open,
    onOpenChange,
}: RescheduleInterviewDialogProps) {
    const tenantId = getTenantId();

    const queryClient = useQueryClient();

    const [date, setDate] = useState("");

    const [startTime, setStartTime] = useState("");

    const [endTime, setEndTime] = useState("");

    const [timezone, setTimezone] = useState(interview.timezone);

    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDate(toDateInputValue(interview.startTime));

        setStartTime(toTimeInputValue(interview.startTime));

        setEndTime(toTimeInputValue(interview.endTime));

        setTimezone(
            interview.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        );

        setValidationError(null);
    }, [open, interview]);

    const mutation = useMutation({
        mutationFn: () =>
            rescheduleInterview(interview.id, {
                startTime: localDateTimeToIso(date, startTime),

                endTime: localDateTimeToIso(date, endTime),

                timezone,
            }),

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

            toast.success("Interview rescheduled");

            onOpenChange(false);
        },

        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to reschedule interview");
        },
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setValidationError(null);

        if (!date || !startTime || !endTime || !timezone.trim()) {
            setValidationError("Date, start time, end time and timezone are required.");

            return;
        }

        const start = new Date(`${date}T${startTime}:00`);

        const end = new Date(`${date}T${endTime}:00`);

        if (end.getTime() <= start.getTime()) {
            setValidationError("End time must be after start time.");

            return;
        }

        mutation.mutate();
    };

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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CalendarClock className="size-5" />
                            Reschedule interview
                        </DialogTitle>

                        <DialogDescription>
                            Change the date or time for {interview.title}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            type="date"
                            value={date}
                            disabled={mutation.isPending}
                            onChange={(event) => setDate(event.target.value)}
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                type="time"
                                value={startTime}
                                disabled={mutation.isPending}
                                onChange={(event) => setStartTime(event.target.value)}
                            />

                            <Input
                                type="time"
                                value={endTime}
                                disabled={mutation.isPending}
                                onChange={(event) => setEndTime(event.target.value)}
                            />
                        </div>

                        <Input
                            value={timezone}
                            disabled={mutation.isPending}
                            onChange={(event) => setTimezone(event.target.value)}
                        />

                        {validationError ? (
                            <p className="text-sm text-destructive">{validationError}</p>
                        ) : null}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>

                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Rescheduling..." : "Reschedule"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
