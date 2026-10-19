import {
    useState,
} from "react";

import {
    Button,
} from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Textarea,
} from "@/components/ui/textarea";

type Props = {
    loading?: boolean;

    onConfirm: (
        reason: string,
    ) => Promise<void>;
};

export function RejectOfferDialog({
    loading = false,
    onConfirm,
}: Props) {
    const [open, setOpen] =
        useState(false);

    const [reason, setReason] =
        useState("");

    const valid =
        reason.trim().length > 0;

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="destructive"
                >
                    Reject
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Reject offer
                    </DialogTitle>

                    <DialogDescription>
                        Explain why this
                        offer cannot be
                        approved.
                    </DialogDescription>
                </DialogHeader>

                <Textarea
                    rows={5}
                    value={reason}
                    placeholder="Rejection reason..."
                    onChange={(event) =>
                        setReason(
                            event.target
                                .value,
                        )
                    }
                />

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setOpen(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        disabled={
                            loading ||
                            !valid
                        }
                        onClick={async () => {
                            await onConfirm(
                                reason.trim(),
                            );

                            setReason("");
                            setOpen(false);
                        }}
                    >
                        {loading
                            ? "Rejecting..."
                            : "Reject offer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}