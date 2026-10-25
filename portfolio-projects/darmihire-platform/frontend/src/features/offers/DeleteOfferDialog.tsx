import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ConfirmOfferActionDialog } from "./ConfirmOfferActionDialog";

export function DeleteOfferDialog({
    loading,
    onConfirm,
}: {
    loading?: boolean;
    onConfirm: () => Promise<void>;
}) {
    return (
        <ConfirmOfferActionDialog
            destructive
            loading={loading}
            title="Delete draft offer?"
            description="This draft will be permanently deleted. This action cannot be undone."
            confirmLabel="Delete draft"
            onConfirm={onConfirm}
            trigger={
                <Button size="sm" variant="destructive">
                    <Trash2 className="mr-2 size-4" />
                    Delete
                </Button>
            }
        />
    );
}
