import { Badge } from "@/components/ui/badge";

import {
    OFFER_STATUS_LABELS,
} from "./offerUtils";

import type {
    OfferStatus,
} from "./types";

export function OfferStatusBadge({
    status,
}: {
    status: OfferStatus;
}) {
    const variant =
        status === "ACCEPTED"
            ? "default"
            : status === "REJECTED" ||
                status === "DECLINED" ||
                status === "WITHDRAWN"
              ? "destructive"
              : "secondary";

    return (
        <Badge variant={variant}>
            {
                OFFER_STATUS_LABELS[
                    status
                ]
            }
        </Badge>
    );
}