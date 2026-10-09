import {
  useMemo,
  useState,
} from "react";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type {
  CollisionDetection,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";

import {
  ApplicationDragOverlay,
} from "./ApplicationDragOverlay";

import {
  ApplicationPipelineColumn,
} from "./ApplicationPipelineColumn";

import type {
  ApplicationStage,
  JobApplication,
} from "./types";

type ApplicationPipelineProps = {
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

const PIPELINE_STAGES: Array<{
  stage: ApplicationStage;
  title: string;
}> = [
  {
    stage: "APPLIED",
    title: "Applied",
  },
  {
    stage: "SCREENING",
    title: "Screening",
  },
  {
    stage: "INTERVIEW",
    title: "Interview",
  },
  {
    stage: "OFFER",
    title: "Offer",
  },
  {
    stage: "HIRED",
    title: "Hired",
  },
];

/*
 * For a Kanban board, pointerWithin gives
 * intuitive column detection.
 *
 * rectIntersection is the fallback.
 */
const collisionDetectionStrategy:
  CollisionDetection = (args) => {
    const pointerCollisions =
      pointerWithin(args);

    if (
      pointerCollisions.length >
      0
    ) {
      return pointerCollisions;
    }

    return rectIntersection(args);
  };

export function ApplicationPipeline({
  applications,
  onStageChange,
  onReject,
  onWithdraw,
  isPending = false,
}: ApplicationPipelineProps) {
  const [
    activeApplication,
    setActiveApplication,
  ] =
    useState<JobApplication | null>(
      null,
    );

  const sensors = useSensors(
    useSensor(
      PointerSensor,
      {
        activationConstraint: {
          distance: 4,
        },
      },
    ),
  );

  const pipelineApplications =
    useMemo(
      () =>
        applications.filter(
          (application) =>
            application.status ===
              "ACTIVE" ||
            application.status ===
              "HIRED",
        ),
      [applications],
    );

  function handleDragStart(
    event: DragStartEvent,
  ) {
    const application =
      event.active.data.current
        ?.application as
        | JobApplication
        | undefined;

    if (!application) {
      return;
    }

    console.log(
      "[DND] Drag started",
      {
        applicationId:
          application.id,
        stage:
          application.stage,
      },
    );

    setActiveApplication(
      application,
    );
  }

  function handleDragCancel() {
    console.log(
      "[DND] Drag cancelled",
    );

    setActiveApplication(null);
  }

  function handleDragEnd(
    event: DragEndEvent,
  ) {
    const application =
      event.active.data.current
        ?.application as
        | JobApplication
        | undefined;

    const targetType =
      event.over?.data.current
        ?.type as
        | string
        | undefined;

    const targetStage =
      event.over?.data.current
        ?.stage as
        | ApplicationStage
        | undefined;

    console.log(
      "[DND] Drag ended",
      {
        applicationId:
          application?.id,
        currentStage:
          application?.stage,
        overId:
          event.over?.id,
        targetType,
        targetStage,
      },
    );

    setActiveApplication(null);

    if (!application) {
      return;
    }

    if (
      application.status !==
      "ACTIVE"
    ) {
      return;
    }

    if (!event.over) {
      console.warn(
        "[DND] Candidate was not dropped over a pipeline column.",
      );

      return;
    }

    if (
      targetType !== "stage"
    ) {
      console.warn(
        "[DND] Invalid drop target.",
      );

      return;
    }

    if (!targetStage) {
      console.warn(
        "[DND] Drop target has no stage.",
      );

      return;
    }

    const validStage =
      PIPELINE_STAGES.some(
        ({ stage }) =>
          stage ===
          targetStage,
      );

    if (!validStage) {
      console.warn(
        "[DND] Invalid stage:",
        targetStage,
      );

      return;
    }

    if (
      application.stage ===
      targetStage
    ) {
      return;
    }

    console.log(
      "[DND] Moving application",
      application.id,
      application.stage,
      "->",
      targetStage,
    );

    onStageChange(
      application,
      targetStage,
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={
        collisionDetectionStrategy
      }
      onDragStart={
        handleDragStart
      }
      onDragCancel={
        handleDragCancel
      }
      onDragEnd={
        handleDragEnd
      }
    >
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex min-w-max gap-4">
          {PIPELINE_STAGES.map(
            ({
              stage,
              title,
            }) => {
              const stageApplications =
                pipelineApplications.filter(
                  (
                    application,
                  ) =>
                    application.stage ===
                    stage,
                );

              return (
                <ApplicationPipelineColumn
                  key={stage}
                  stage={stage}
                  title={title}
                  applications={
                    stageApplications
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
              );
            },
          )}
        </div>
      </div>

      <DragOverlay
        dropAnimation={null}
      >
        {activeApplication ? (
          <ApplicationDragOverlay
            application={
              activeApplication
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}