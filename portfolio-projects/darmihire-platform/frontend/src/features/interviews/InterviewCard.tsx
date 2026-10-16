import { useState } from "react";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Ban,
    CalendarClock,
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    MoreHorizontal,
    Video,
} from "lucide-react";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InterviewFeedbackPanel } from "@/features/interview-feedback/InterviewFeedbackPanel";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    applicationQueryKeys,
} from "@/features/applications/queryKeys";

import { getTenantId } from "@/utils/session";

import {
    removeInterviewer,
} from "./api";

import {
    AssignInterviewerDialog,
} from "./AssignInterviewerDialog";

import {
    CancelInterviewDialog,
} from "./CancelInterviewDialog";

import {
    CompleteInterviewDialog,
} from "./CompleteInterviewDialog";

import {
    formatInterviewDateTime,
} from "./dateTime";

import {
    InterviewerList,
} from "./InterviewerList";

import {
    interviewQueryKeys,
} from "./queryKeys";

import {
    RescheduleInterviewDialog,
} from "./RescheduleInterviewDialog";

import type {
    Interview,
    InterviewStatus,
    InterviewType,
} from "./types";

type InterviewCardProps = {
    interview: Interview;
};

const typeLabels: Record<
    InterviewType,
    string
> = {
    PHONE_SCREEN:
        "Phone screen",

    VIDEO_INTERVIEW:
        "Video interview",

    TECHNICAL_INTERVIEW:
        "Technical interview",

    BEHAVIORAL_INTERVIEW:
        "Behavioral interview",

    HR_INTERVIEW:
        "HR interview",

    HIRING_MANAGER_INTERVIEW:
        "Hiring manager interview",

    PANEL_INTERVIEW:
        "Panel interview",

    FINAL_INTERVIEW:
        "Final interview",

    OTHER:
        "Other",
};

const statusLabels: Record<
    InterviewStatus,
    string
> = {
    SCHEDULED:
        "Scheduled",

    IN_PROGRESS:
        "In progress",

    COMPLETED:
        "Completed",

    CANCELLED:
        "Cancelled",
};

export function InterviewCard({
    interview,
}: InterviewCardProps) {
    const tenantId = getTenantId();

    const queryClient =
        useQueryClient();

    const [
        assignDialogOpen,
        setAssignDialogOpen,
    ] = useState(false);

    const [
        rescheduleDialogOpen,
        setRescheduleDialogOpen,
    ] = useState(false);

    const [
        cancelDialogOpen,
        setCancelDialogOpen,
    ] = useState(false);

    const [
        completeDialogOpen,
        setCompleteDialogOpen,
    ] = useState(false);

    const removeMutation =
        useMutation({
            mutationFn: (
                interviewerId: string,
            ) =>
                removeInterviewer(
                    interview.id,
                    interviewerId,
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
                    "Interviewer removed",
                );
            },

            onError: (error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to remove interviewer",
                );
            },
        });

    const editable =
        interview.status !==
        "COMPLETED" &&
        interview.status !==
        "CANCELLED";

    const canReschedule =
        interview.status ===
        "SCHEDULED";

    const canCancel =
        interview.status ===
        "SCHEDULED" ||
        interview.status ===
        "IN_PROGRESS";

    const canComplete =
        interview.status ===
        "SCHEDULED" ||
        interview.status ===
        "IN_PROGRESS";

    const hasActions =
        canReschedule ||
        canCancel ||
        canComplete;

    return (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-base">
                                {interview.title}
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                {
                                    typeLabels[
                                    interview
                                        .interviewType
                                    ]
                                }
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    interview.status ===
                                        "CANCELLED"
                                        ? "destructive"
                                        : interview.status ===
                                            "COMPLETED"
                                            ? "secondary"
                                            : "default"
                                }
                            >
                                {
                                    statusLabels[
                                    interview.status
                                    ]
                                }
                            </Badge>

                            {hasActions ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        asChild
                                    >
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <MoreHorizontal className="size-4" />

                                            <span className="sr-only">
                                                Interview actions
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                    >
                                        {canReschedule ? (
                                            <DropdownMenuItem
                                                onSelect={() =>
                                                    setRescheduleDialogOpen(
                                                        true,
                                                    )
                                                }
                                                onClick={() =>
                                                    setRescheduleDialogOpen(
                                                        true,
                                                    )
                                                }
                                            >
                                                <CalendarClock className="mr-2 size-4" />
                                                Reschedule
                                            </DropdownMenuItem>
                                        ) : null}

                                        {canComplete ? (
                                            <DropdownMenuItem
                                                onSelect={() =>
                                                    setCompleteDialogOpen(
                                                        true,
                                                    )
                                                }
                                                onClick={() =>
                                                    setCompleteDialogOpen(
                                                        true,
                                                    )
                                                }
                                            >
                                                <CheckCircle2 className="mr-2 size-4" />
                                                Mark completed
                                            </DropdownMenuItem>
                                        ) : null}

                                        {canCancel ? (
                                            <>
                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onSelect={() =>
                                                        setCancelDialogOpen(
                                                            true,
                                                        )
                                                    }
                                                    onClick={() =>
                                                        setCancelDialogOpen(
                                                            true,
                                                        )
                                                    }
                                                >
                                                    <Ban className="mr-2 size-4" />
                                                    Cancel interview
                                                </DropdownMenuItem>
                                            </>
                                        ) : null}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : null}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div className="space-y-3">
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

                                <span>
                                    {interview.location}
                                </span>
                            </div>
                        ) : null}

                        {interview.meetingUrl ? (
                            <div className="flex items-start gap-2 text-sm">
                                <Video className="mt-0.5 size-4 text-muted-foreground" />

                                <a
                                    href={
                                        interview.meetingUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="break-all text-primary underline-offset-4 hover:underline"
                                >
                                    Join meeting
                                </a>
                            </div>
                        ) : null}
                    </div>

                    {interview.status ===
                        "CANCELLED" &&
                        interview.cancellationReason ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                            <p className="text-sm font-medium">
                                Cancellation reason
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                                {
                                    interview.cancellationReason
                                }
                            </p>
                        </div>
                    ) : null}

                    <div className="border-t pt-4">
                        <InterviewerList
                            interviewers={
                                interview.interviewers
                            }
                            disabled={
                                !editable ||
                                removeMutation.isPending
                            }
                            onAdd={() =>
                                setAssignDialogOpen(
                                    true,
                                )
                            }
                            onRemove={(
                                interviewerId,
                            ) =>
                                removeMutation.mutate(
                                    interviewerId,
                                )
                            }
                        />
                    </div>
                    {interview.notes ? (
                        <div className="border-t pt-4">
                            <p className="text-sm font-medium">
                                Notes
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                                {interview.notes}
                            </p>
                        </div>
                    ) : null}

                    {/* Interview Feedback */}
                    {tenantId ? (
                        <div className="border-t pt-4">
                            <InterviewFeedbackPanel
                                tenantId={tenantId}
                                interviewId={interview.id}
                            />
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            <AssignInterviewerDialog
                interview={interview}
                open={assignDialogOpen}
                onOpenChange={
                    setAssignDialogOpen
                }
            />

            <RescheduleInterviewDialog
                interview={interview}
                open={
                    rescheduleDialogOpen
                }
                onOpenChange={
                    setRescheduleDialogOpen
                }
            />

            <CancelInterviewDialog
                interview={interview}
                open={
                    cancelDialogOpen
                }
                onOpenChange={
                    setCancelDialogOpen
                }
            />

            <CompleteInterviewDialog
                interview={interview}
                open={
                    completeDialogOpen
                }
                onOpenChange={
                    setCompleteDialogOpen
                }
            />
        </>
    );
}