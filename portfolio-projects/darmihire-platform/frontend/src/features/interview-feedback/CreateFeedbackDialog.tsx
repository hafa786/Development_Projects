import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { getActiveScorecardTemplates } from "@/features/scorecards/api";

import { scorecardQueryKeys } from "@/features/scorecards/queryKeys";

import { createInterviewFeedback } from "./api";

import { interviewFeedbackQueryKeys } from "./queryKeys";

type Props = {
    tenantId: string;
    interviewId: string;
};

export function CreateFeedbackDialog({ tenantId, interviewId }: Props) {
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);

    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

    const templatesQuery = useQuery({
        queryKey: scorecardQueryKeys.active(tenantId),

        queryFn: getActiveScorecardTemplates,

        enabled: open,
    });

    const mutation = useMutation({
        mutationFn: () =>
            createInterviewFeedback({
                interviewId,
                templateId: selectedTemplateId,

                recommendation: null,
                overallComments: null,
                strengths: null,
                concerns: null,

                ratings: [],
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: interviewFeedbackQueryKeys.mine(tenantId, interviewId),
            });

            toast.success("Feedback draft created");

            setOpen(false);
        },

        onError: (error: Error) => {
            toast.error(error.message || "Failed to create feedback");
        },
    });

    const templates = templatesQuery.data ?? [];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Give feedback
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Start interview feedback</DialogTitle>

                    <DialogDescription>
                        Select the scorecard you want to use for this evaluation. The scorecard
                        cannot be changed after the feedback draft is created.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                    {templatesQuery.isLoading ? (
                        <p className="text-sm text-muted-foreground">Loading scorecards...</p>
                    ) : templates.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-6 text-center">
                            <p className="font-medium">No active scorecards</p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                An active scorecard is required before feedback can be created.
                            </p>
                        </div>
                    ) : (
                        templates.map((template) => {
                            const selected = selectedTemplateId === template.id;

                            return (
                                <button
                                    key={template.id}
                                    type="button"
                                    onClick={() => setSelectedTemplateId(template.id)}
                                    className={[
                                        "w-full rounded-lg border p-4 text-left",
                                        selected ? "border-primary bg-muted" : "hover:bg-muted/50",
                                    ].join(" ")}
                                >
                                    <div className="font-medium">{template.name}</div>

                                    {template.description && (
                                        <div className="mt-1 text-sm text-muted-foreground">
                                            {template.description}
                                        </div>
                                    )}

                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {template.criteria.length} criteria
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>

                    <Button
                        disabled={!selectedTemplateId || mutation.isPending}
                        onClick={() => mutation.mutate()}
                    >
                        {mutation.isPending ? "Creating..." : "Start evaluation"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
