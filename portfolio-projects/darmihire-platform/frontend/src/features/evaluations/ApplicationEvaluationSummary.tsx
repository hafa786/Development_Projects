import { useQuery } from "@tanstack/react-query";

import { ClipboardCheck } from "lucide-react";

import { getApplicationEvaluationSummary } from "./api";

import { evaluationQueryKeys } from "./queryKeys";

import { CriterionSummary } from "./CriterionSummary";

import { EvaluationScoreCard } from "./EvaluationScoreCard";

import { InterviewEvaluationCard } from "./InterviewEvaluationCard";

import { RecommendationSummary } from "./RecommendationSummary";

type Props = {
    tenantId: string;
    applicationId: string;
};

export function ApplicationEvaluationSummary({ tenantId, applicationId }: Props) {
    const query = useQuery({
        queryKey: evaluationQueryKeys.summary(tenantId, applicationId),

        queryFn: () => getApplicationEvaluationSummary(applicationId),
    });

    if (query.isLoading) {
        return (
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                Loading evaluation summary...
            </div>
        );
    }

    if (query.isError) {
        return (
            <div className="rounded-lg border p-6">
                <p className="font-medium">Unable to load evaluation summary</p>

                <p className="mt-1 text-sm text-muted-foreground">
                    {query.error instanceof Error
                        ? query.error.message
                        : "An unexpected error occurred."}
                </p>
            </div>
        );
    }

    const summary = query.data;

    if (!summary || summary.submittedFeedbackCount === 0) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <ClipboardCheck className="mx-auto size-10 text-muted-foreground" />

                <h3 className="mt-4 font-semibold">No submitted evaluations</h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                    Interview evaluation results will appear here after interviewers submit their
                    feedback.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Evaluation summary</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Consolidated results from submitted interview feedback.
                </p>
            </div>

            <EvaluationScoreCard
                score={summary.weightedScore}
                feedbackCount={summary.submittedFeedbackCount}
            />

            <RecommendationSummary recommendations={summary.recommendations} />

            <CriterionSummary criteria={summary.criteria} />

            <div className="space-y-4">
                <h3 className="font-semibold">Interview evaluations</h3>

                {summary.interviews.map((interview) => (
                    <InterviewEvaluationCard key={interview.interviewId} interview={interview} />
                ))}
            </div>
        </div>
    );
}
