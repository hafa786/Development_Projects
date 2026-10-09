import { useDraggable } from "@dnd-kit/core";
import {
    GripVertical,
    Mail,
    MapPin,
    MoreHorizontal,
    MoveRight,
    UserRound,
    XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {
    ApplicationStage,
    JobApplication,
} from "./types";

type ApplicationCardProps = {
    application: JobApplication;

    onStageChange: (
        application: JobApplication,
        stage: ApplicationStage,
    ) => void;

    onReject: (
        application: JobApplication,
    ) => void;

    onWithdraw: (
        application: JobApplication,
    ) => void;

    isPending?: boolean;
};

const stages: Array<{
    value: ApplicationStage;
    label: string;
}> = [
        {
            value: "APPLIED",
            label: "Applied",
        },
        {
            value: "SCREENING",
            label: "Screening",
        },
        {
            value: "INTERVIEW",
            label: "Interview",
        },
        {
            value: "OFFER",
            label: "Offer",
        },
        {
            value: "HIRED",
            label: "Hired",
        },
    ];

export function ApplicationCard({
    application,
    onStageChange,
    onReject,
    onWithdraw,
    isPending = false,
}: ApplicationCardProps) {
    const navigate = useNavigate();

    const canDrag =
        application.status === "ACTIVE" &&
        application.stage !== "HIRED" &&
        !isPending;

    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging,
    } = useDraggable({
        id: application.id,

        disabled: !canDrag,

        data: {
            type: "application",
            application,
        },
    });

    const isActive =
        application.status === "ACTIVE";

    return (
        <div
            ref={setNodeRef}
            className={[
                "rounded-lg border bg-background p-3 shadow-sm",
                "transition-all duration-150",
                canDrag
                    ? "hover:shadow-md"
                    : "",
                isDragging
                    ? "opacity-30"
                    : "opacity-100",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-start gap-2">
                    {/* Drag handle */}

                    {canDrag ? (
                        <button
                            type="button"
                            {...listeners}
                            {...attributes}
                            className="
                mt-0.5
                cursor-grab
                touch-none
                rounded-md
                p-1
                text-muted-foreground
                transition-colors
                hover:bg-muted
                hover:text-foreground
                active:cursor-grabbing
              "
                            aria-label={`Drag ${application.candidateFullName}`}
                        >
                            <GripVertical className="h-4 w-4" />
                        </button>
                    ) : (
                        <div className="mt-0.5 p-1">
                            <UserRound className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}

                    {/* Candidate */}

                    <div className="min-w-0 flex-1">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/candidates/${application.candidateId}`,
                                )
                            }
                            className="
                block
                max-w-full
                truncate
                text-left
                text-sm
                font-semibold
                hover:underline
              "
                        >
                            {application.candidateFullName}
                        </button>

                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {application.candidateEmail}
                        </p>
                    </div>
                </div>

                {/* Actions */}

                {isActive && (
                    <div
                        className="shrink-0"
                        onPointerDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={isPending}
                                    aria-label="Application actions"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-48"
                            >
                                
                                Move to
                                <DropdownMenuSeparator />

                                {stages.map((stage) => {
                                    const currentStage =
                                        stage.value ===
                                        application.stage;

                                    return (
                                        <DropdownMenuItem
                                            key={stage.value}
                                            disabled={
                                                currentStage ||
                                                isPending
                                            }
                                            onSelect={() => {
                                                if (
                                                    currentStage ||
                                                    isPending
                                                ) {
                                                    return;
                                                }

                                                onStageChange(
                                                    application,
                                                    stage.value,
                                                );
                                            }}
                                            onClick={() => {
                                                if (
                                                    currentStage ||
                                                    isPending
                                                ) {
                                                    return;
                                                }

                                                onStageChange(
                                                    application,
                                                    stage.value,
                                                );
                                            }}

                                        >
                                            <MoveRight className="mr-2 h-4 w-4" />

                                            {stage.label}

                                            {currentStage && (
                                                <span className="ml-auto text-xs text-muted-foreground">
                                                    Current
                                                </span>
                                            )}
                                        </DropdownMenuItem>
                                    );
                                })}

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    disabled={isPending}
                                    className="text-destructive focus:text-destructive"
                                    onSelect={() => {
                                        if (!isPending) {
                                            onReject(
                                                application,
                                            );
                                        }
                                    }}
                                    onClick={() => {
                                        if (!isPending) {
                                            onReject(
                                                application,
                                            );
                                        }
                                    }}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />

                                    Reject
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    disabled={isPending}
                                    onSelect={() => {
                                        if (!isPending) {
                                            onWithdraw(
                                                application,
                                            );
                                        }
                                    }}
                                    onClick={() => {
                                        if (!isPending) {
                                            onWithdraw(
                                                application,
                                            );
                                        }
                                    }}
                                >
                                    Withdraw
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>

            {/* Candidate details */}

            <div className="mt-3 space-y-1.5">
                {application.candidateLocation && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">
                            {application.candidateLocation}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />

                    <span className="truncate">
                        {application.candidateEmail}
                    </span>
                </div>
            </div>

            {/* Footer */}

            <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
                <span className="text-[11px] text-muted-foreground">
                    Applied{" "}
                    {formatRelativeDate(
                        application.appliedAt,
                    )}
                </span>

                {application.status !==
                    "ACTIVE" && (
                        <ApplicationStatusBadge
                            status={
                                application.status
                            }
                        />
                    )}
            </div>
        </div>
    );
}

function ApplicationStatusBadge({
    status,
}: {
    status: JobApplication["status"];
}) {
    switch (status) {
        case "HIRED":
            return <Badge>Hired</Badge>;

        case "REJECTED":
            return (
                <Badge variant="destructive">
                    Rejected
                </Badge>
            );

        case "WITHDRAWN":
            return (
                <Badge variant="secondary">
                    Withdrawn
                </Badge>
            );

        default:
            return null;
    }
}

function formatRelativeDate(
    value: string,
) {
    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return "";
    }

    const now = new Date();

    const difference =
        now.getTime() -
        date.getTime();

    const dayInMilliseconds =
        1000 * 60 * 60 * 24;

    const days = Math.floor(
        difference /
        dayInMilliseconds,
    );

    if (days <= 0) {
        return "today";
    }

    if (days === 1) {
        return "1 day ago";
    }

    if (days < 30) {
        return `${days} days ago`;
    }

    if (days < 365) {
        const months =
            Math.floor(
                days / 30,
            );

        return months === 1
            ? "1 month ago"
            : `${months} months ago`;
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    ).format(date);
}