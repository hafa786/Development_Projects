import { useState } from "react";

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

type Props = {
    trigger: React.ReactNode;

    title: string;

    description: string;

    confirmLabel: string;

    loading?: boolean;

    destructive?: boolean;

    onConfirm: () => Promise<void>;
};

export function ConfirmOfferActionDialog({
    trigger,
    title,
    description,
    confirmLabel,
    loading = false,
    destructive = false,
    onConfirm,
}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>

                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>

                    <Button
                        variant={destructive ? "destructive" : "default"}
                        disabled={loading}
                        onClick={async () => {
                            await onConfirm();

                            setOpen(false);
                        }}
                    >
                        {loading ? "Processing..." : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
