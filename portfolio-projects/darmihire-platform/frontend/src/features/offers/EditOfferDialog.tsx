import {
    useState,
} from "react";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Pencil,
} from "lucide-react";

import { toast } from "sonner";

import {
    Button,
} from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    updateOffer,
} from "./api";

import {
    OfferForm,
} from "./OfferForm";

import {
    offerQueryKeys,
} from "./queryKeys";

import type {
    OfferFormValues,
} from "./schemas";

import type {
    Offer,
} from "./types";

export function EditOfferDialog({
    tenantId,
    offer,
}: {
    tenantId: string;
    offer: Offer;
}) {
    const [open, setOpen] =
        useState(false);

    const queryClient =
        useQueryClient();

    const mutation = useMutation({
        mutationFn: (
            values: OfferFormValues,
        ) =>
            updateOffer(
                offer.id,
                {
                    salary:
                        values.salary,

                    currency:
                        values.currency
                            .trim()
                            .toUpperCase(),

                    salaryPeriod:
                        values.salaryPeriod,

                    employmentType:
                        values.employmentType,

                    startDate:
                        values.startDate ||
                        null,

                    expirationDate:
                        values.expirationDate ||
                        null,

                    probationPeriod:
                        values.probationPeriod
                            ?.trim() ||
                        null,

                    benefits:
                        values.benefits
                            ?.trim() ||
                        null,

                    additionalTerms:
                        values.additionalTerms
                            ?.trim() ||
                        null,
                },
            ),

        onSuccess: async () => {
            await queryClient
                .invalidateQueries({
                    queryKey:
                        offerQueryKeys.application(
                            tenantId,
                            offer.applicationId,
                        ),
                });

            toast.success(
                "Offer updated",
            );

            setOpen(false);
        },

        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to update offer",
            );
        },
    });

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                >
                    <Pencil className="mr-2 size-4" />

                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Edit offer
                    </DialogTitle>
                </DialogHeader>

                <OfferForm
                    submitLabel="Save changes"
                    submitting={
                        mutation.isPending
                    }
                    defaultValues={{
                        salary:
                            offer.salary,

                        currency:
                            offer.currency,

                        salaryPeriod:
                            offer.salaryPeriod,

                        employmentType:
                            offer.employmentType,

                        startDate:
                            offer.startDate ??
                            "",

                        expirationDate:
                            offer.expirationDate ??
                            "",

                        probationPeriod:
                            offer.probationPeriod ??
                            "",

                        benefits:
                            offer.benefits ??
                            "",

                        additionalTerms:
                            offer.additionalTerms ??
                            "",
                    }}
                    onSubmit={async (
                        values,
                    ) => {
                        await mutation
                            .mutateAsync(
                                values,
                            );
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}