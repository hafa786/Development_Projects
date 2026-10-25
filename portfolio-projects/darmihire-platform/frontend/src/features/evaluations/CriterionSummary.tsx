import type { CriterionEvaluationSummary as Criterion } from "./types";

type Props = {
    criteria: Criterion[];
};

export function CriterionSummary({ criteria }: Props) {
    return (
        <div className="rounded-lg border p-5">
            <h3 className="font-semibold">Scorecard results</h3>

            <div className="mt-4 space-y-4">
                {criteria.map((criterion) => (
                    <div key={criterion.criterionId} className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className="text-sm font-medium">{criterion.criterionName}</div>

                                <div className="text-xs text-muted-foreground">
                                    {criterion.responseCount} responses · Weight {criterion.weight}
                                </div>
                            </div>

                            <div className="font-semibold">
                                {criterion.averageRating.toFixed(2)}
                                /5
                            </div>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full bg-primary"
                                style={{
                                    width: `${(criterion.averageRating / 5) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
