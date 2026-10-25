import { UserPlus, UserRound, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { InterviewInterviewer } from "./types";

type InterviewerListProps = {
    interviewers: InterviewInterviewer[];
    disabled?: boolean;
    onAdd: () => void;
    onRemove: (interviewerId: string) => void;
};

export function InterviewerList({
    interviewers,
    disabled = false,
    onAdd,
    onRemove,
}: InterviewerListProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Interviewers</p>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                    onClick={onAdd}
                >
                    <UserPlus className="mr-2 size-4" />
                    Add interviewer
                </Button>
            </div>

            {interviewers.length === 0 ? (
                <div className="rounded-lg border border-dashed px-4 py-5 text-center">
                    <UserRound className="mx-auto size-6 text-muted-foreground" />

                    <p className="mt-2 text-sm font-medium">No interviewers assigned</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Add workspace members who will conduct this interview.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {interviewers.map((interviewer) => (
                        <div
                            key={interviewer.id}
                            className="flex items-center justify-between rounded-lg border px-3 py-2"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                                    <UserRound className="size-4" />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {interviewer.name}
                                    </p>

                                    <p className="truncate text-xs text-muted-foreground">
                                        {interviewer.email}
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={disabled}
                                aria-label={`Remove ${interviewer.name}`}
                                onClick={() => onRemove(interviewer.tenantUserId)}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
