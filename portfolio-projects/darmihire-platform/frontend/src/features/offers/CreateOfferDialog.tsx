import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FileSignature } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { createOffer } from "./api";

import { OfferForm } from "./OfferForm";

import { offerQueryKeys } from "./queryKeys";

import type { OfferFormValues } from "./schemas";

type Props = {
    tenantId: string;
    applicationId: string;
};

export function CreateOfferDialog({ tenantId, applicationId }: Props) {
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (values: OfferFormValues) =>
            createOffer({
                applicationId,

                salary: values.salary,

                currency: values.currency.trim().toUpperCase(),

                salaryPeriod: values.salaryPeriod,

                employmentType: values.employmentType,

                startDate: values.startDate || null,

                expirationDate: values.expirationDate || null,

                probationPeriod: values.probationPeriod?.trim() || null,

                benefits: values.benefits?.trim() || null,

                additionalTerms: values.additionalTerms?.trim() || null,
            }),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: offerQueryKeys.application(tenantId, applicationId),
            });

            toast.success("Offer created");

            setOpen(false);
        },

        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Unable to create offer");
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <FileSignature className="mr-2 size-4" />
                    Create offer
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create offer</DialogTitle>
                </DialogHeader>

                <OfferForm
                    submitLabel="Create offer"
                    submitting={mutation.isPending}
                    onSubmit={async (values) => {
                        await mutation.mutateAsync(values);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
