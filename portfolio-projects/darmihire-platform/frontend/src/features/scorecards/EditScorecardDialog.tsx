import { useEffect, useState, type FormEvent } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Pencil } from "lucide-react";
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

import { updateScorecardTemplate } from "./api";
import { scorecardQueryKeys } from "./queryKeys";

import type { ScorecardTemplate } from "./types";

type Props = {
    tenantId?: string | null;
    template: ScorecardTemplate;
};

export function EditScorecardDialog({ tenantId, template }: Props) {
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);

    const [name, setName] = useState(template.name);

    const [description, setDescription] = useState(template.description ?? "");

    useEffect(() => {
        if (!open) {
            setName(template.name);
            setDescription(template.description ?? "");
        }
    }, [open, template.name, template.description]);

    const mutation = useMutation({
        mutationFn: () =>
            updateScorecardTemplate(template.id, {
                name: name.trim(),
                description: description.trim() || null,
            }),

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

            toast.success("Scorecard updated");

            setOpen(false);
        },

        onError: (error: Error) => {
            toast.error(error.message || "Failed to update scorecard");
        },
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim()) {
            toast.error("Template name is required");
            return;
        }

        mutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit scorecard</DialogTitle>

                        <DialogDescription>
                            Update the scorecard name and description.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-5">
                        <div className="space-y-2">
                            <Label htmlFor="edit-scorecard-name">Name</Label>

                            <Input
                                id="edit-scorecard-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                maxLength={200}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-scorecard-description">Description</Label>

                            <Textarea
                                id="edit-scorecard-description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>

                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
