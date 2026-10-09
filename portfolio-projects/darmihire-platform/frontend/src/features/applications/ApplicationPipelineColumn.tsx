import {
    useDroppable,
} from "@dnd-kit/core";

import {
    ApplicationCard,
} from "./ApplicationCard";

import type {
    ApplicationStage,
    JobApplication,
} from "./types";

type ApplicationPipelineColumnProps = {
    stage: ApplicationStage;

    title: string;

    applications: JobApplication[];

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

export function ApplicationPipelineColumn({
    stage,
    title,
    applications,
    onStageChange,
    onReject,
    onWithdraw,
    isPending = false,
}: ApplicationPipelineColumnProps) {
    const {
        setNodeRef,
        isOver,
    } = useDroppable({
        id: `pipeline-stage-${stage}`,

        data: {
            type: "stage",
            stage,
        },
    });

    return (
        <div
            ref={setNodeRef}
            data-stage={stage}
            className={[
                "flex",
                "min-h-[440px]",
                "w-[290px]",
                "shrink-0",
                "flex-col",
                "rounded-xl",
                "border",
                "transition-all",
                "duration-150",

                isOver
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "bg-muted/30",
            ].join(" ")}
        >
            {/* Header */}

            <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-semibold">
                    {title}
                </h3>

                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-background px-2 text-xs font-medium text-muted-foreground">
                    {applications.length}
                </span>
            </div>

            {/* Cards / drop zone */}

            <div className="flex flex-1 flex-col gap-3 p-3">
                {applications.map(
                    (application) => (
                        <ApplicationCard
                            key={application.id}
                            application={
                                application
                            }
                            onStageChange={
                                onStageChange
                            }
                            onReject={
                                onReject
                            }
                            onWithdraw={
                                onWithdraw
                            }
                            isPending={
                                isPending
                            }
                        />
                    ),
                )}

                {/* Keep a large drop zone available
            even when the column has cards. */}

                <div
                    className={[
                        "flex",
                        "min-h-[90px]",
                        "flex-1",
                        "items-center",
                        "justify-center",
                        "rounded-lg",
                        "border",
                        "border-dashed",
                        "p-4",
                        "text-center",
                        "text-xs",
                        "transition-colors",

                        isOver
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-transparent text-muted-foreground",
                    ].join(" ")}
                >
                    {applications.length === 0
                        ? "Drop candidate here"
                        : isOver
                            ? `Move to ${title}`
                            : ""}
                </div>
            </div>
        </div>
    );
}