import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { FileSignature } from "lucide-react";

import { getOffers } from "../features/offers/api";

import { OfferCard } from "../features/offers/OfferCard";

import { offerQueryKeys } from "../features/offers/queryKeys";

import type { OfferStatus } from "../features/offers/types";

import { getTenantId } from "@/utils/session";

const filters: Array<{
    label: string;
    value: "ALL" | OfferStatus;
}> = [
    {
        label: "All",
        value: "ALL",
    },
    {
        label: "Draft",
        value: "DRAFT",
    },
    {
        label: "Pending",
        value: "PENDING_APPROVAL",
    },
    {
        label: "Approved",
        value: "APPROVED",
    },
    {
        label: "Sent",
        value: "SENT",
    },
    {
        label: "Accepted",
        value: "ACCEPTED",
    },
    {
        label: "Declined",
        value: "DECLINED",
    },
    {
        label: "Rejected",
        value: "REJECTED",
    },
    {
        label: "Withdrawn",
        value: "WITHDRAWN",
    },
];

export function OffersPage() {
    const tenantId = getTenantId();

    const [filter, setFilter] = useState<"ALL" | OfferStatus>("ALL");

    const status = filter === "ALL" ? undefined : filter;

    const query = useQuery({
        queryKey: offerQueryKeys.list(tenantId, status),

        queryFn: () => getOffers(status),

        enabled: Boolean(tenantId),
    });

    if (!tenantId) {
        return <div className="p-6">No tenant selected.</div>;
    }

    return (
        <div className="space-y-5 p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Offers</h1>

                <p className="mt-1 text-muted-foreground">Manage offers, approvals and hiring.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {filters.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => setFilter(item.value)}
                        className={
                            filter === item.value
                                ? "rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
                                : "rounded-md border px-3 py-2 text-sm hover:bg-muted"
                        }
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {query.isLoading && (
                <div className="rounded-lg border p-8 text-sm text-muted-foreground">
                    Loading offers...
                </div>
            )}

            {query.isError && <div className="rounded-lg border p-8">Unable to load offers.</div>}

            {query.data && query.data.length === 0 && (
                <div className="rounded-lg border border-dashed p-10 text-center">
                    <FileSignature className="mx-auto size-10 text-muted-foreground" />

                    <h2 className="mt-4 font-semibold">No offers</h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        No offers match this filter.
                    </p>
                </div>
            )}

            <div className="space-y-4">
                {query.data?.map((offer) => (
                    <div key={offer.id}>
                        <div className="mb-2">
                            <p className="font-semibold">{offer.candidateName}</p>

                            <p className="text-sm text-muted-foreground">{offer.jobTitle}</p>
                        </div>

                        <OfferCard tenantId={tenantId} offer={offer} />
                    </div>
                ))}
            </div>
        </div>
    );
}
