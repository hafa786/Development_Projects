import { useEffect, useState, type FormEvent } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Pencil, Plus } from "lucide-react";

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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { addScorecardCriterion, updateScorecardCriterion } from "./api";

import { scorecardQueryKeys } from "./queryKeys";

import type { ScorecardCriterion, ScorecardTemplate } from "./types";

type Props = {
    tenantId?: string | null;
    template: ScorecardTemplate;
    criterion?: ScorecardCriterion;
};

export function ScorecardCriterionDialog({
    tenantId,
    template,
    criterion,
}: Props) {
    const queryClient = useQueryClient();

    const editing = Boolean(criterion);

    const [open, setOpen] = useState(false);

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");

    const [sortOrder, setSortOrder] = useState(1);

    const [weight, setWeight] = useState(1);

    const [required, setRequired] = useState(true);

    const resetForm = () => {
        if (criterion) {
            setName(criterion.name);

            setDescription(criterion.description ?? "");

            setSortOrder(criterion.sortOrder);

            setWeight(criterion.weight);

            setRequired(criterion.required);

            return;
        }

        setName("");
        setDescription("");

        setSortOrder(template.criteria.length + 1);

        setWeight(1);
        setRequired(true);
    };

    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open, criterion, template.criteria.length]);

    const mutation = useMutation({
        mutationFn: () => {
            const request = {
                name: name.trim(),

                description: description.trim() || null,

                sortOrder,
                required,
                weight,
            };

            if (criterion) {
                return updateScorecardCriterion(template.id, criterion.id, request);
            }

            return addScorecardCriterion(template.id, request);
        },

        onSuccess: async () => {
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

            toast.success(editing ? "Criterion updated" : "Criterion added");

            setOpen(false);
        },

        onError: (error: Error) => {
            toast.error(error.message || "Failed to save criterion");
        },
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim()) {
            toast.error("Criterion name is required");
            return;
        }

        if (sortOrder < 0) {
            toast.error("Sort order cannot be negative");
            return;
        }

        if (weight < 1 || weight > 100) {
            toast.error("Weight must be between 1 and 100");
            return;
        }

        mutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {criterion ? (
                    <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add criterion
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? "Edit criterion" : "Add criterion"}
                        </DialogTitle>

                        <DialogDescription>
                            Define what interviewers should evaluate.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-5">
                        <div className="space-y-2">
                            <Label>Criterion name</Label>

                            <Input
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Technical knowledge"
                                maxLength={200}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>

                            <Textarea
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="What should the interviewer evaluate?"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Sort order</Label>

                                <Input
                                    type="number"
                                    min={0}
                                    value={sortOrder}
                                    onChange={(event) => setSortOrder(Number(event.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Weight</Label>

                                <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={weight}
                                    onChange={(event) => setWeight(Number(event.target.value))}
                                />
                            </div>
                        </div>

                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                            <input
                                type="checkbox"
                                checked={required}
                                onChange={(event) => setRequired(event.target.checked)}
                                className="h-4 w-4"
                            />

                            <div>
                                <div className="text-sm font-medium">Required criterion</div>

                                <div className="text-xs text-muted-foreground">
                                    Interviewers must provide a rating before submitting feedback.
                                </div>
                            </div>
                        </label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending
                                ? "Saving..."
                                : editing
                                    ? "Save changes"
                                    : "Add criterion"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
