import { ClipboardCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    score: number;
    feedbackCount: number;
};

export function EvaluationScoreCard({ score, feedbackCount }: Props) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <ClipboardCheck className="size-4" />
                    Overall evaluation
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">{score.toFixed(2)}</span>

                    <span className="pb-1 text-muted-foreground">/ 5</span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                    Based on {feedbackCount} submitted{" "}
                    {feedbackCount === 1 ? "evaluation" : "evaluations"}.
                </p>
            </CardContent>
        </Card>
    );
}
