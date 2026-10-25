import { CheckCircle2, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getRatingLabel } from "./rating";

import type { HiringRecommendation, InterviewFeedback } from "./types";

const recommendationLabels: Record<HiringRecommendation, string> = {
    STRONG_NO: "Strong No",
    NO: "No",
    NEUTRAL: "Neutral",
    YES: "Yes",
    STRONG_YES: "Strong Yes",
};

type Props = {
    feedback: InterviewFeedback;
};

export function SubmittedFeedbackView({ feedback }: Props) {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold">{feedback.templateName}</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Interview feedback by {feedback.interviewerName}
                    </p>
                </div>

                <Badge variant="secondary">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Submitted
                </Badge>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Lock className="h-4 w-4" />
                    Feedback locked
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                    Submitted feedback cannot be edited.
                </p>
            </div>

            <div className="space-y-3">
                {feedback.ratings
                    .slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((rating) => (
                        <Card key={rating.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between gap-4">
                                    <CardTitle className="text-base">
                                        {rating.criterionName}
                                    </CardTitle>

                                    <div className="text-right">
                                        <div className="text-xl font-semibold">
                                            {rating.rating ?? "—"}
                                            /5
                                        </div>

                                        {rating.rating && (
                                            <div className="text-xs text-muted-foreground">
                                                {getRatingLabel(rating.rating)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            {rating.comments && (
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {rating.comments}
                                    </p>
                                </CardContent>
                            )}
                        </Card>
                    ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Strengths</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="whitespace-pre-wrap text-sm">
                            {feedback.strengths || "No strengths provided."}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Concerns</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="whitespace-pre-wrap text-sm">
                            {feedback.concerns || "No concerns provided."}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Overall assessment</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <div className="text-sm text-muted-foreground">Recommendation</div>

                        <div className="mt-1 font-semibold">
                            {feedback.recommendation
                                ? recommendationLabels[feedback.recommendation]
                                : "—"}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-muted-foreground">Comments</div>

                        <p className="mt-1 whitespace-pre-wrap text-sm">
                            {feedback.overallComments || "No overall comments provided."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
