export type HiringRecommendation = "STRONG_NO" | "NO" | "NEUTRAL" | "YES" | "STRONG_YES";

export type InterviewFeedbackRatingRequest = {
    criterionId: string;
    rating: number;
    comments?: string | null;
};

export type CreateInterviewFeedbackRequest = {
    interviewId: string;
    templateId: string;

    recommendation?: HiringRecommendation | null;

    overallComments?: string | null;
    strengths?: string | null;
    concerns?: string | null;

    ratings: InterviewFeedbackRatingRequest[];
};

export type UpdateInterviewFeedbackRequest = {
    recommendation?: HiringRecommendation | null;

    overallComments?: string | null;
    strengths?: string | null;
    concerns?: string | null;

    ratings: InterviewFeedbackRatingRequest[];
};

export type InterviewFeedbackRating = {
    id: string;

    criterionId: string;
    criterionName: string;
    criterionDescription: string | null;

    sortOrder: number;
    required: boolean;
    weight: number;

    rating: number;
    comments: string | null;
};

export type InterviewFeedback = {
    id: string;

    interviewId: string;
    applicationId: string;

    interviewerId: string;
    interviewerName: string;

    templateId: string;
    templateName: string;

    recommendation: HiringRecommendation | null;

    overallComments: string | null;
    strengths: string | null;
    concerns: string | null;

    submitted: boolean;
    submittedAt: string | null;

    ratings: InterviewFeedbackRating[];

    createdAt: string;
    updatedAt: string;
};
