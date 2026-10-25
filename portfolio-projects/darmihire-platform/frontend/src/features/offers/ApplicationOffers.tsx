import { useQuery } from "@tanstack/react-query";

import { FileSignature } from "lucide-react";

import { getApplicationOffers } from "./api";

import { CreateOfferDialog } from "./CreateOfferDialog";

import { OfferCard } from "./OfferCard";

import { offerQueryKeys } from "./queryKeys";

type Props = {
    tenantId: string;

    applicationId: string;

    applicationStatus: "ACTIVE" | "HIRED" | "REJECTED" | "WITHDRAWN" | string;

    canManage?: boolean;

    canApprove?: boolean;

    onApplicationChanged?: () => Promise<void> | void;
};

export function ApplicationOffers({
    tenantId,
    applicationId,
    applicationStatus,
    canManage = true,
    canApprove = true,
    onApplicationChanged,
}: Props) {
    const query = useQuery({
        queryKey: offerQueryKeys.application(tenantId, applicationId),

        queryFn: () => getApplicationOffers(applicationId),

        enabled: Boolean(tenantId) && Boolean(applicationId),
    });

    if (query.isLoading) {
        return (
            <div className="rounded-lg border p-6">
                <p className="text-sm text-muted-foreground">Loading offers...</p>
            </div>
        );
    }

    if (query.isError) {
        return (
            <div className="rounded-lg border p-6">
                <p className="font-medium">Unable to load offers</p>

                <p className="mt-1 text-sm text-muted-foreground">
                    {query.error instanceof Error
                        ? query.error.message
                        : "An unexpected error occurred."}
                </p>
            </div>
        );
    }

    const offers = query.data ?? [];

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">Offers</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage offer compensation, approvals and hiring.
                    </p>
                </div>

                {canManage && applicationStatus === "ACTIVE" && (
                    <CreateOfferDialog tenantId={tenantId} applicationId={applicationId} />
                )}
            </div>

            {applicationStatus === "HIRED" && (
                <div className="rounded-lg border bg-muted/30 p-4">
                    <p className="font-medium">Candidate hired</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        This application has completed the hiring workflow.
                    </p>
                </div>
            )}

            {offers.length === 0 ? (
                <div className="rounded-lg border border-dashed p-10 text-center">
                    <FileSignature className="mx-auto size-10 text-muted-foreground" />

                    <h3 className="mt-4 font-semibold">No offers yet</h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                        Create an offer when the candidate is ready to move forward in the hiring
                        process.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {offers.map((offer) => (
                        <OfferCard
                            key={offer.id}
                            tenantId={tenantId}
                            offer={offer}
                            canManage={canManage}
                            canApprove={canApprove}
                            onApplicationChanged={onApplicationChanged}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
