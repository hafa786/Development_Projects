import {
  Badge,
} from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type {
  HiringRecommendation,
} from "@/features/interview-feedback/types";

import type {
  InterviewEvaluationSummary,
} from "./types";

type Props = {
  interview:
    InterviewEvaluationSummary;
};

const recommendationLabels:
  Record<
    HiringRecommendation,
    string
  > = {
    STRONG_NO: "Strong No",
    NO: "No",
    NEUTRAL: "Neutral",
    YES: "Yes",
    STRONG_YES: "Strong Yes",
  };

export function InterviewEvaluationCard({
  interview,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">
              {interview.interviewTitle}
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {
                interview.submittedFeedbackCount
              }{" "}
              submitted evaluations
            </p>
          </div>

          <div className="text-xl font-semibold">
            {interview.weightedScore.toFixed(
              2,
            )}
            /5
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {interview.interviewers.map(
          (evaluation) => (
            <div
              key={
                evaluation.feedbackId
              }
              className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-medium">
                  {
                    evaluation.interviewerName
                  }
                </div>

                <div className="text-sm text-muted-foreground">
                  Score{" "}
                  {evaluation.weightedScore.toFixed(
                    2,
                  )}
                  /5
                </div>
              </div>

              <Badge variant="secondary">
                {
                  recommendationLabels[
                    evaluation
                      .recommendation
                  ]
                }
              </Badge>
            </div>
          ),
        )}
      </CardContent>
    </Card>
  );
}