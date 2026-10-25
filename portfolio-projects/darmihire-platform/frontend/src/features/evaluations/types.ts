import type { HiringRecommendation } from "@/features/interview-feedback/types";

export type RecommendationDistribution = {
    strongNo: number;
    no: number;
    neutral: number;
    yes: number;
    strongYes: number;
};

export type CriterionEvaluationSummary = {
    criterionId: string;
    criterionName: string;
    averageRating: number;
    responseCount: number;
    weight: number;
};

export type InterviewerEvaluation = {
    feedbackId: string;
    interviewId: string;
    interviewerId: string;
    interviewerName: string;
    recommendation: HiringRecommendation;
    weightedScore: number;
    submittedAt: string;
};

export type InterviewEvaluationSummary = {
    interviewId: string;
    interviewTitle: string;
    weightedScore: number;
    submittedFeedbackCount: number;
    interviewers: InterviewerEvaluation[];
};

export type ApplicationEvaluationSummary = {
    applicationId: string;
    weightedScore: number;
    submittedFeedbackCount: number;

    recommendations: RecommendationDistribution;

    criteria: CriterionEvaluationSummary[];

    interviews: InterviewEvaluationSummary[];
};
