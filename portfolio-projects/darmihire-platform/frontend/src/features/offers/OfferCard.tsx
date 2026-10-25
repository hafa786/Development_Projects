import { Check, CheckCircle2, Send, Upload } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    acceptOffer,
    approveOffer,
    declineOffer,
    deleteOffer,
    rejectOffer,
    sendOffer,
    submitOffer,
    withdrawOffer,
} from "./api";

import { ConfirmOfferActionDialog } from "./ConfirmOfferActionDialog";

import { DeclineOfferDialog } from "./DeclineOfferDialog";

import { DeleteOfferDialog } from "./DeleteOfferDialog";

import { EditOfferDialog } from "./EditOfferDialog";

import { OfferStatusBadge } from "./OfferStatusBadge";

import { RejectOfferDialog } from "./RejectOfferDialog";

import { WithdrawOfferDialog } from "./WithdrawOfferDialog";

import {
    EMPLOYMENT_TYPE_LABELS,
    formatDate,
    formatDateTime,
    formatMoney,
    getOfferCurrentEvent,
    SALARY_PERIOD_LABELS,
} from "./offerUtils";

import { offerQueryKeys } from "./queryKeys";

import type { Offer } from "./types";

type Props = {
    tenantId: string;
    offer: Offer;

    /**
     * Set according to your authenticated
     * user's role/permissions.
     */
    canManage?: boolean;
    canApprove?: boolean;

    /**
     * Called after an offer action.
     * Application detail page can use this
     * to invalidate its own query/activity.
     */
    onApplicationChanged?: () => Promise<void> | void;
};

export function OfferCard({
    tenantId,
    offer,
    canManage = true,
    canApprove = true,
    onApplicationChanged,
}: Props) {
    const queryClient = useQueryClient();

    const refresh = async () => {
        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: offerQueryKeys.application(tenantId, offer.applicationId),
            }),

            queryClient.invalidateQueries({
                queryKey: offerQueryKeys.lists(),
            }),
        ]);

        await onApplicationChanged?.();
    };

    const simpleMutation = useMutation({
        mutationFn: (operation: "submit" | "approve" | "send" | "accept") => {
            switch (operation) {
                case "submit":
                    return submitOffer(offer.id);

                case "approve":
                    return approveOffer(offer.id);

                case "send":
                    return sendOffer(offer.id);

                case "accept":
                    return acceptOffer(offer.id);
            }
        },

        onSuccess: async (_, operation) => {
            await refresh();

            const messages = {
                submit: "Offer submitted for approval",
                approve: "Offer approved",
                send: "Offer marked as sent",
                accept: "Offer accepted and candidate hired",
            };

            toast.success(messages[operation]);
        },

        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Offer action failed");
        },
    });

    const rejectMutation = useMutation({
        mutationFn: (reason: string) => rejectOffer(offer.id, reason),

        onSuccess: async () => {
            await refresh();

            toast.success("Offer rejected");
        },

        onError: showError,
    });

    const declineMutation = useMutation({
        mutationFn: (reason?: string) => declineOffer(offer.id, reason),

        onSuccess: async () => {
            await refresh();

            toast.success("Offer declined");
        },

        onError: showError,
    });

    const withdrawMutation = useMutation({
        mutationFn: (reason: string) => withdrawOffer(offer.id, reason),

        onSuccess: async () => {
            await refresh();

            toast.success("Offer withdrawn");
        },

        onError: showError,
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteOffer(offer.id),

        onSuccess: async () => {
            await refresh();

            toast.success("Draft offer deleted");
        },

        onError: showError,
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <CardTitle className="text-xl">
                            {formatMoney(offer.salary, offer.currency)}
                        </CardTitle>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {SALARY_PERIOD_LABELS[offer.salaryPeriod]}
                            {" · "}
                            {EMPLOYMENT_TYPE_LABELS[offer.employmentType]}
                        </p>
                    </div>

                    <OfferStatusBadge status={offer.status} />
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Detail label="Start date" value={formatDate(offer.startDate)} />

                    <Detail label="Offer expires" value={formatDate(offer.expirationDate)} />

                    <Detail label="Probation" value={offer.probationPeriod ?? "Not specified"} />

                    <Detail label="Created by" value={offer.createdByName ?? "Unknown"} />
                </div>

                {offer.approvedByName && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Detail label="Approved by" value={offer.approvedByName} />

                        <Detail label="Approved" value={formatDateTime(offer.approvedAt)} />
                    </div>
                )}

                {offer.benefits && <TextSection title="Benefits" value={offer.benefits} />}

                {offer.additionalTerms && (
                    <TextSection title="Additional terms" value={offer.additionalTerms} />
                )}

                {offer.rejectionReason && (
                    <ReasonSection title="Rejection reason" value={offer.rejectionReason} />
                )}

                {offer.declineReason && (
                    <ReasonSection title="Decline reason" value={offer.declineReason} />
                )}

                {offer.withdrawalReason && (
                    <ReasonSection title="Withdrawal reason" value={offer.withdrawalReason} />
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                    <p className="text-xs text-muted-foreground">
                        Last lifecycle event: {formatDateTime(getOfferCurrentEvent(offer))}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {canManage && offer.status === "DRAFT" && (
                            <>
                                <EditOfferDialog tenantId={tenantId} offer={offer} />

                                <DeleteOfferDialog
                                    loading={deleteMutation.isPending}
                                    onConfirm={async () => {
                                        await deleteMutation.mutateAsync();
                                    }}
                                />

                                <ConfirmOfferActionDialog
                                    title="Submit offer for approval?"
                                    description="The draft will become read-only while it is awaiting approval."
                                    confirmLabel="Submit for approval"
                                    loading={simpleMutation.isPending}
                                    onConfirm={async () => {
                                        await simpleMutation.mutateAsync("submit");
                                    }}
                                    trigger={
                                        <Button size="sm">
                                            <Upload className="mr-2 size-4" />
                                            Submit
                                        </Button>
                                    }
                                />
                            </>
                        )}

                        {canApprove && offer.status === "PENDING_APPROVAL" && (
                            <>
                                <ConfirmOfferActionDialog
                                    title="Approve offer?"
                                    description="The recruiter will be able to send this offer to the candidate."
                                    confirmLabel="Approve"
                                    loading={simpleMutation.isPending}
                                    onConfirm={async () => {
                                        await simpleMutation.mutateAsync("approve");
                                    }}
                                    trigger={
                                        <Button size="sm">
                                            <Check className="mr-2 size-4" />
                                            Approve
                                        </Button>
                                    }
                                />

                                <RejectOfferDialog
                                    loading={rejectMutation.isPending}
                                    onConfirm={async (reason) => {
                                        await rejectMutation.mutateAsync(reason);
                                    }}
                                />
                            </>
                        )}

                        {canManage && offer.status === "APPROVED" && (
                            <>
                                <ConfirmOfferActionDialog
                                    title="Mark offer as sent?"
                                    description="Confirm that this approved offer has been sent to the candidate."
                                    confirmLabel="Mark as sent"
                                    loading={simpleMutation.isPending}
                                    onConfirm={async () => {
                                        await simpleMutation.mutateAsync("send");
                                    }}
                                    trigger={
                                        <Button size="sm">
                                            <Send className="mr-2 size-4" />
                                            Mark as sent
                                        </Button>
                                    }
                                />

                                <WithdrawOfferDialog
                                    loading={withdrawMutation.isPending}
                                    onConfirm={async (reason) => {
                                        await withdrawMutation.mutateAsync(reason);
                                    }}
                                />
                            </>
                        )}

                        {canManage && offer.status === "SENT" && (
                            <>
                                <ConfirmOfferActionDialog
                                    title="Accept offer and hire candidate?"
                                    description="This will mark the offer as accepted and move the application to Hired. This should only be used after the candidate has accepted the offer."
                                    confirmLabel="Accept & hire"
                                    loading={simpleMutation.isPending}
                                    onConfirm={async () => {
                                        await simpleMutation.mutateAsync("accept");
                                    }}
                                    trigger={
                                        <Button size="sm">
                                            <CheckCircle2 className="mr-2 size-4" />
                                            Accept & hire
                                        </Button>
                                    }
                                />

                                <DeclineOfferDialog
                                    loading={declineMutation.isPending}
                                    onConfirm={async (reason) => {
                                        await declineMutation.mutateAsync(reason);
                                    }}
                                />

                                <WithdrawOfferDialog
                                    loading={withdrawMutation.isPending}
                                    onConfirm={async (reason) => {
                                        await withdrawMutation.mutateAsync(reason);
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 text-sm font-medium">{value}</p>
        </div>
    );
}

function TextSection({ title, value }: { title: string; value: string }) {
    return (
        <div>
            <h4 className="text-sm font-semibold">{title}</h4>

            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{value}</p>
        </div>
    );
}

function ReasonSection({ title, value }: { title: string; value: string }) {
    return (
        <div className="rounded-md border p-4">
            <p className="text-sm font-semibold">{title}</p>

            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{value}</p>
        </div>
    );
}

function showError(error: unknown) {
    toast.error(error instanceof Error ? error.message : "Offer action failed");
}
