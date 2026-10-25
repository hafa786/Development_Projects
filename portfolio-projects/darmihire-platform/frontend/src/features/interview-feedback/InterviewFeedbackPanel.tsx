import { useQuery } from "@tanstack/react-query";

import { AlertCircle, ClipboardCheck } from "lucide-react";

import { getMyInterviewFeedback } from "./api";

import { CreateFeedbackDialog } from "./CreateFeedbackDialog";
import { FeedbackForm } from "./FeedbackForm";

import { interviewFeedbackQueryKeys } from "./queryKeys";

import { SubmittedFeedbackView } from "./SubmittedFeedbackView";

type Props = {
    tenantId: string;
    interviewId: string;
};

export function InterviewFeedbackPanel({ tenantId, interviewId }: Props) {
    const query = useQuery({
        queryKey: interviewFeedbackQueryKeys.mine(tenantId, interviewId),

        queryFn: () => getMyInterviewFeedback(interviewId),
    });

    if (query.isLoading) {
        return (
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                Loading interview feedback...
            </div>
        );
    }

    if (query.isError) {
        return (
            <div className="rounded-lg border border-destructive/30 p-6">
                <div className="flex items-center gap-2 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    Unable to load feedback
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                    {query.error instanceof Error
                        ? query.error.message
                        : "An unexpected error occurred."}
                </p>
            </div>
        );
    }

    const feedback = query.data ?? null;

    if (!feedback) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <ClipboardCheck className="mx-auto h-10 w-10 text-muted-foreground" />

                <h3 className="mt-4 font-semibold">Interview feedback</h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                    Complete a structured evaluation using an interview scorecard.
                </p>

                <div className="mt-5">
                    <CreateFeedbackDialog tenantId={tenantId} interviewId={interviewId} />
                </div>
            </div>
        );
    }

    if (feedback.submitted) {
        return <SubmittedFeedbackView feedback={feedback} />;
    }

    return <FeedbackForm tenantId={tenantId} feedback={feedback} />;
}
