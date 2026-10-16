import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Save,
  Send,
} from "lucide-react";
import {
  evaluationQueryKeys,
} from "@/features/evaluations/queryKeys";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  submitInterviewFeedback,
  updateInterviewFeedback,
} from "./api";

import { FeedbackRating } from "./FeedbackRating";

import {
  interviewFeedbackQueryKeys,
} from "./queryKeys";

import type {
  HiringRecommendation,
  InterviewFeedback,
  InterviewFeedbackRatingRequest,
} from "./types";

type Props = {
  tenantId: string;
  feedback: InterviewFeedback;
};

type RatingState = {
  criterionId: string;
  rating: number | null;
  comments: string;
  required: boolean;
};

const recommendations: Array<{
  value: HiringRecommendation;
  label: string;
}> = [
    {
      value: "STRONG_NO",
      label: "Strong No",
    },
    {
      value: "NO",
      label: "No",
    },
    {
      value: "NEUTRAL",
      label: "Neutral",
    },
    {
      value: "YES",
      label: "Yes",
    },
    {
      value: "STRONG_YES",
      label: "Strong Yes",
    },
  ];

export function FeedbackForm({
  tenantId,
  feedback,
}: Props) {
  const queryClient =
    useQueryClient();

  const [
    recommendation,
    setRecommendation,
  ] =
    useState<HiringRecommendation | null>(
      feedback.recommendation,
    );

  const [
    overallComments,
    setOverallComments,
  ] = useState(
    feedback.overallComments ?? "",
  );

  const [strengths, setStrengths] =
    useState(
      feedback.strengths ?? "",
    );

  const [concerns, setConcerns] =
    useState(
      feedback.concerns ?? "",
    );

  const [ratings, setRatings] =
    useState<RatingState[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecommendation(
      feedback.recommendation,
    );

    setOverallComments(
      feedback.overallComments ?? "",
    );

    setStrengths(
      feedback.strengths ?? "",
    );

    setConcerns(
      feedback.concerns ?? "",
    );

    setRatings(
      feedback.ratings
        .slice()
        .sort(
          (a, b) =>
            a.sortOrder -
            b.sortOrder,
        )
        .map((rating) => ({
          criterionId:
            rating.criterionId,

          rating:
            rating.rating ?? null,

          comments:
            rating.comments ?? "",

          required:
            rating.required,
        })),
    );
  }, [feedback]);

  const ratingMap =
    useMemo(
      () =>
        new Map(
          ratings.map((rating) => [
            rating.criterionId,
            rating,
          ]),
        ),
      [ratings],
    );

  const updateRating = (
    criterionId: string,
    patch: Partial<RatingState>,
  ) => {
    setRatings((current) =>
      current.map((rating) =>
        rating.criterionId ===
          criterionId
          ? {
            ...rating,
            ...patch,
          }
          : rating,
      ),
    );
  };

  const buildRatings = () =>
    ratings
      .filter(
        (
          rating,
        ): rating is RatingState & {
          rating: number;
        } =>
          rating.rating !== null,
      )
      .map(
        (
          rating,
        ): InterviewFeedbackRatingRequest => ({
          criterionId:
            rating.criterionId,

          rating:
            rating.rating,

          comments:
            rating.comments.trim() ||
            null,
        }),
      );

  const saveMutation =
    useMutation({
      mutationFn: () =>
        updateInterviewFeedback(
          feedback.id,
          {
            recommendation,

            overallComments:
              overallComments.trim() ||
              null,

            strengths:
              strengths.trim() ||
              null,

            concerns:
              concerns.trim() ||
              null,

            ratings:
              buildRatings(),
          },
        ),

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey:
            interviewFeedbackQueryKeys.mine(
              tenantId,
              feedback.interviewId,
            ),
        });

        toast.success(
          "Feedback draft saved",
        );
      },

      onError: (error: Error) => {
        toast.error(
          error.message ||
          "Failed to save feedback",
        );
      },
    });

  const submitMutation =
    useMutation({
      mutationFn: async () => {
        await updateInterviewFeedback(
          feedback.id,
          {
            recommendation,

            overallComments:
              overallComments.trim() ||
              null,

            strengths:
              strengths.trim() ||
              null,

            concerns:
              concerns.trim() ||
              null,

            ratings:
              buildRatings(),
          },
        );

        return submitInterviewFeedback(
          feedback.id,
        );
      },

      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey:
              interviewFeedbackQueryKeys.mine(
                tenantId,
                feedback.interviewId,
              ),
          }),

          queryClient.invalidateQueries({
            queryKey:
              interviewFeedbackQueryKeys.interview(
                tenantId,
                feedback.interviewId,
              ),
          }),

          queryClient.invalidateQueries({
            queryKey:
              applicationQueryKeys.activities(
                tenantId,
                feedback.applicationId,
              ),
          }),

          queryClient.invalidateQueries({
            queryKey:
              evaluationQueryKeys.summary(
                tenantId,
                feedback.applicationId,
              ),
          }),
        ]);

        toast.success(
          "Interview feedback submitted",
        );
      },

      onError: (error: Error) => {
        toast.error(
          error.message ||
          "Failed to submit feedback",
        );
      },
    });

  const requiredMissing =
    feedback.ratings.some(
      (criterion) => {
        if (!criterion.required) {
          return false;
        }

        return (
          ratingMap.get(
            criterion.criterionId,
          )?.rating == null
        );
      },
    );

  const canSubmit =
    recommendation !== null &&
    !requiredMissing;

  const handleSubmit = () => {
    if (!recommendation) {
      toast.error(
        "Select a hiring recommendation",
      );
      return;
    }

    if (requiredMissing) {
      toast.error(
        "Rate all required criteria before submitting",
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Submit this feedback? Submitted feedback cannot be edited.",
      );

    if (confirmed) {
      submitMutation.mutate();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">
          {feedback.templateName}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Rate the candidate against
          each evaluation criterion.
        </p>
      </div>

      <div className="space-y-4">
        {feedback.ratings
          .slice()
          .sort(
            (a, b) =>
              a.sortOrder -
              b.sortOrder,
          )
          .map((criterion) => {
            const state =
              ratingMap.get(
                criterion.criterionId,
              );

            return (
              <FeedbackRating
                key={
                  criterion.criterionId
                }
                name={
                  criterion.criterionName
                }
                description={
                  criterion.criterionDescription
                }
                required={
                  criterion.required
                }
                weight={
                  criterion.weight
                }
                rating={
                  state?.rating ?? null
                }
                comments={
                  state?.comments ?? ""
                }
                onRatingChange={(
                  rating,
                ) =>
                  updateRating(
                    criterion.criterionId,
                    { rating },
                  )
                }
                onCommentsChange={(
                  comments,
                ) =>
                  updateRating(
                    criterion.criterionId,
                    { comments },
                  )
                }
              />
            );
          })}
      </div>

      <div className="space-y-3">
        <Label>
          Hiring recommendation
        </Label>

        <div className="grid gap-2 sm:grid-cols-5">
          {recommendations.map(
            (option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setRecommendation(
                    option.value,
                  )
                }
                className={[
                  "rounded-md border px-3 py-3 text-sm font-medium",
                  recommendation ===
                    option.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                ].join(" ")}
              >
                {option.label}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <Label>
            Strengths
          </Label>

          <Textarea
            value={strengths}
            onChange={(event) =>
              setStrengths(
                event.target.value,
              )
            }
            placeholder="What did the candidate do particularly well?"
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Concerns
          </Label>

          <Textarea
            value={concerns}
            onChange={(event) =>
              setConcerns(
                event.target.value,
              )
            }
            placeholder="Any risks, concerns, or areas requiring further validation?"
            rows={5}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Overall comments
        </Label>

        <Textarea
          value={overallComments}
          onChange={(event) =>
            setOverallComments(
              event.target.value,
            )
          }
          placeholder="Summarize your overall interview assessment..."
          rows={6}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          disabled={
            saveMutation.isPending ||
            submitMutation.isPending
          }
          onClick={() =>
            saveMutation.mutate()
          }
        >
          <Save className="mr-2 h-4 w-4" />

          {saveMutation.isPending
            ? "Saving..."
            : "Save draft"}
        </Button>

        <Button
          disabled={
            !canSubmit ||
            saveMutation.isPending ||
            submitMutation.isPending
          }
          onClick={handleSubmit}
        >
          <Send className="mr-2 h-4 w-4" />

          {submitMutation.isPending
            ? "Submitting..."
            : "Submit feedback"}
        </Button>
      </div>
    </div>
  );
}