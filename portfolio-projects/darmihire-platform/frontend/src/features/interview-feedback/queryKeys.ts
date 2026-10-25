export const interviewFeedbackQueryKeys = {
    all: ["interview-feedback"] as const,

    interview: (tenantId: string | null | undefined, interviewId: string) =>
        [...interviewFeedbackQueryKeys.all, "interview", tenantId, interviewId] as const,

    mine: (tenantId: string | null | undefined, interviewId: string) =>
        [...interviewFeedbackQueryKeys.all, "mine", tenantId, interviewId] as const,

    detail: (tenantId: string | null | undefined, feedbackId: string) =>
        [...interviewFeedbackQueryKeys.all, "detail", tenantId, feedbackId] as const,
};
