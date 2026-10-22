import { useEffect, useState } from "react";

import {
    CalendarDays,
    Globe2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import type { Job } from "./types";

type PublishJobDialogProps = {
    open: boolean;
    job: Job | null;
    isPending: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (
        applicationDeadline: string | null,
    ) => void;
};

export function PublishJobDialog({
    open,
    job,
    isPending,
    onOpenChange,
    onConfirm,
}: PublishJobDialogProps) {
    const [
        applicationDeadline,
        setApplicationDeadline,
    ] = useState("");

    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setApplicationDeadline(
                job?.applicationDeadline ?? "",
            );
        }
    }, [
        open,
        job?.applicationDeadline,
    ]);

    const today = new Date()
        .toISOString()
        .slice(0, 10);

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Globe2 className="size-5" />
                        Publish job
                    </DialogTitle>

                    <DialogDescription>
                        Publish{" "}
                        <strong>
                            {job?.title}
                        </strong>{" "}
                        to your public careers page.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="applicationDeadline"
                            className="flex items-center gap-2"
                        >
                            <CalendarDays className="size-4" />
                            Application deadline
                        </Label>

                        <Input
                            id="applicationDeadline"
                            type="date"
                            min={today}
                            value={applicationDeadline}
                            onChange={(event) =>
                                setApplicationDeadline(
                                    event.target.value,
                                )
                            }
                        />

                        <p className="text-xs text-muted-foreground">
                            Optional. Leave empty if
                            the position should remain
                            open without a deadline.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        disabled={isPending}
                        onClick={() =>
                            onOpenChange(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={
                            isPending || !job
                        }
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() =>
                            onConfirm(
                                applicationDeadline ||
                                null,
                            )
                        }
                    >
                        {isPending
                            ? "Publishing..."
                            : "Publish job"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}