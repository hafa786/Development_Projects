import type {
    EmploymentType,
    Offer,
    OfferStatus,
    SalaryPeriod,
} from "./types";

export const OFFER_STATUS_LABELS:
    Record<OfferStatus, string> = {
        DRAFT: "Draft",
        PENDING_APPROVAL:
            "Pending approval",
        APPROVED: "Approved",
        REJECTED: "Rejected",
        SENT: "Sent",
        ACCEPTED: "Accepted",
        DECLINED: "Declined",
        WITHDRAWN: "Withdrawn",
    };

export const SALARY_PERIOD_LABELS:
    Record<SalaryPeriod, string> = {
        HOURLY: "Hourly",
        MONTHLY: "Monthly",
        ANNUAL: "Annual",
    };

export const EMPLOYMENT_TYPE_LABELS:
    Record<EmploymentType, string> = {
        FULL_TIME: "Full time",
        PART_TIME: "Part time",
        CONTRACT: "Contract",
        TEMPORARY: "Temporary",
        INTERNSHIP: "Internship",
    };

export function formatMoney(
    amount: number,
    currency: string,
): string {
    try {
        return new Intl.NumberFormat(
            undefined,
            {
                style: "currency",
                currency,
                maximumFractionDigits: 2,
            },
        ).format(amount);
    } catch {
        return `${amount.toLocaleString()} ${currency}`;
    }
}

export function formatDate(
    value: string | null,
): string {
    if (!value) {
        return "Not specified";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        },
    ).format(
        new Date(
            `${value}T00:00:00`,
        ),
    );
}

export function formatDateTime(
    value: string | null,
): string {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        },
    ).format(
        new Date(value),
    );
}

export function getOfferCurrentEvent(
    offer: Offer,
): string | null {
    switch (offer.status) {
        case "PENDING_APPROVAL":
            return offer
                .submittedForApprovalAt;

        case "APPROVED":
            return offer.approvedAt;

        case "REJECTED":
            return offer.rejectedAt;

        case "SENT":
            return offer.sentAt;

        case "ACCEPTED":
            return offer.acceptedAt;

        case "DECLINED":
            return offer.declinedAt;

        case "WITHDRAWN":
            return offer.withdrawnAt;

        default:
            return offer.createdAt;
    }
}