import { useState, type FormEvent } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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

import { createScorecardTemplate } from "./api";
import { scorecardQueryKeys } from "./queryKeys";

type Props = {
    tenantId?: string | null;
};

export function CreateScorecardDialog({
    tenantId,
}: Props) {
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] =
        useState("");

    const mutation = useMutation({
        mutationFn: createScorecardTemplate,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    scorecardQueryKeys.list(tenantId),
            });

            await queryClient.invalidateQueries({
                queryKey:
                    scorecardQueryKeys.active(tenantId),
            });

            toast.success(
                "Scorecard template created",
            );

            setName("");
            setDescription("");
            setOpen(false);
        },

        onError: (error: Error) => {
            toast.error(
                error.message ||
                "Failed to create scorecard template",
            );
        },
    });

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            toast.error(
                "Template name is required",
            );
            return;
        }

        mutation.mutate({
            name: trimmedName,
            description:
                description.trim() || null,
            criteria: [],
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New scorecard
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            Create scorecard
                        </DialogTitle>

                        <DialogDescription>
                            Create a reusable interview
                            evaluation template.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-5">
                        <div className="space-y-2">
                            <Label htmlFor="scorecard-name">
                                Name
                            </Label>

                            <Input
                                id="scorecard-name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Software Engineer Scorecard"
                                maxLength={200}
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="scorecard-description">
                                Description
                            </Label>

                            <Textarea
                                id="scorecard-description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value,
                                    )
                                }
                                placeholder="Standard evaluation criteria for software engineering interviews."
                                rows={4}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending
                                ? "Creating..."
                                : "Create scorecard"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}