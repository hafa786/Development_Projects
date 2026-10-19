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

export function WithdrawOfferDialog({
    loading = false,
    onConfirm,
}: {
    loading?: boolean;

    onConfirm: (
        reason: string,
    ) => Promise<void>;
}) {
    const [open, setOpen] =
        useState(false);

    const [reason, setReason] =
        useState("");

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
                    Withdraw
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Withdraw offer
                    </DialogTitle>

                    <DialogDescription>
                        The offer will no
                        longer be available
                        for acceptance.
                    </DialogDescription>
                </DialogHeader>

                <Textarea
                    rows={5}
                    value={reason}
                    placeholder="Reason for withdrawal..."
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
                            !reason.trim()
                        }
                        onClick={async () => {
                            await onConfirm(
                                reason.trim(),
                            );

                            setReason("");
                            setOpen(false);
                        }}
                    >
                        Withdraw offer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}