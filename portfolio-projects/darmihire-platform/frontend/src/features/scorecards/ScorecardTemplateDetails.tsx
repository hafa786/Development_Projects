import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CheckCircle2, CircleOff, Trash2 } from "lucide-react";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    activateScorecardTemplate,
    deactivateScorecardTemplate,
    deleteScorecardCriterion,
} from "./api";

import { EditScorecardDialog } from "./EditScorecardDialog";
import { ScorecardCriterionDialog } from "./ScorecardCriterionDialog";
import { scorecardQueryKeys } from "./queryKeys";

import type { ScorecardCriterion, ScorecardTemplate } from "./types";

type Props = {
    tenantId?: string | null;
    template: ScorecardTemplate;
};

export function ScorecardTemplateDetails({ tenantId, template }: Props) {
    const queryClient = useQueryClient();

    const invalidate = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: scorecardQueryKeys.list(tenantId),
            }),

            queryClient.invalidateQueries({
                queryKey: scorecardQueryKeys.active(tenantId),
            }),

            queryClient.invalidateQueries({
                queryKey: scorecardQueryKeys.detail(tenantId, template.id),
            }),
        ]);
    };

    const statusMutation = useMutation({
        mutationFn: () =>
            template.active
                ? deactivateScorecardTemplate(template.id)
                : activateScorecardTemplate(template.id),

        onSuccess: async () => {
            await invalidate();

            toast.success(template.active ? "Scorecard deactivated" : "Scorecard activated");
        },

        onError: (error: Error) => {
            toast.error(error.message || "Failed to change scorecard status");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (criterionId: string) => deleteScorecardCriterion(template.id, criterionId),

        onSuccess: async () => {
            await invalidate();

            toast.success("Criterion deleted");
        },

        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete criterion");
        },
    });

    const handleDelete = (criterion: ScorecardCriterion) => {
        const confirmed = window.confirm(`Delete "${criterion.name}" from this scorecard?`);

        if (!confirmed) {
            return;
        }

        deleteMutation.mutate(criterion.id);
    };

    const criteria = [...template.criteria].sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <CardTitle>{template.name}</CardTitle>

                                {template.active ? (
                                    <Badge variant="secondary">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">
                                        <CircleOff className="mr-1 h-3 w-3" />
                                        Inactive
                                    </Badge>
                                )}
                            </div>

                            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                                {template.description || "No description provided."}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <EditScorecardDialog tenantId={tenantId} template={template} />

                            <Button
                                variant={template.active ? "outline" : "default"}
                                size="sm"
                                disabled={statusMutation.isPending}
                                onClick={() => statusMutation.mutate()}
                            >
                                {template.active ? "Deactivate" : "Activate"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg">Evaluation criteria</CardTitle>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Configure what interviewers should evaluate.
                            </p>
                        </div>

                        <ScorecardCriterionDialog tenantId={tenantId} template={template} />
                    </div>
                </CardHeader>

                <CardContent>
                    {criteria.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <p className="font-medium">No criteria yet</p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Add evaluation criteria to make this scorecard usable.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {criteria.map((criterion) => (
                                <div
                                    key={criterion.id}
                                    className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                #{criterion.sortOrder}
                                            </span>

                                            <span className="font-medium">{criterion.name}</span>

                                            <Badge variant="outline">
                                                Weight {criterion.weight}
                                            </Badge>

                                            <Badge
                                                variant={
                                                    criterion.required ? "secondary" : "outline"
                                                }
                                            >
                                                {criterion.required ? "Required" : "Optional"}
                                            </Badge>
                                        </div>

                                        {criterion.description && (
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {criterion.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1">
                                        <ScorecardCriterionDialog
                                            tenantId={tenantId}
                                            template={template}
                                            criterion={criterion}
                                        />

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={deleteMutation.isPending}
                                            onClick={() => handleDelete(criterion)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
