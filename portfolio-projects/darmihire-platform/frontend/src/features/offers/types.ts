export type OfferStatus =
    | "DRAFT"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "REJECTED"
    | "SENT"
    | "ACCEPTED"
    | "DECLINED"
    | "WITHDRAWN";

export type SalaryPeriod =
    | "HOURLY"
    | "MONTHLY"
    | "ANNUAL";

export type EmploymentType =
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACT"
    | "TEMPORARY"
    | "INTERNSHIP";

export interface Offer {
    id: string;

    applicationId: string;

    candidateId: string;
    candidateName: string;

    jobId: string;
    jobTitle: string;

    status: OfferStatus;

    salary: number;
    currency: string;

    salaryPeriod: SalaryPeriod;
    employmentType: EmploymentType;

    startDate: string | null;
    expirationDate: string | null;

    probationPeriod: string | null;

    benefits: string | null;
    additionalTerms: string | null;

    createdById: string | null;
    createdByName: string | null;

    approvedById: string | null;
    approvedByName: string | null;

    submittedForApprovalAt: string | null;
    approvedAt: string | null;
    rejectedAt: string | null;
    sentAt: string | null;
    acceptedAt: string | null;
    declinedAt: string | null;
    withdrawnAt: string | null;

    rejectionReason: string | null;
    declineReason: string | null;
    withdrawalReason: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface CreateOfferRequest {
    applicationId: string;

    salary: number;
    currency: string;

    salaryPeriod: SalaryPeriod;
    employmentType: EmploymentType;

    startDate: string | null;
    expirationDate: string | null;

    probationPeriod: string | null;

    benefits: string | null;
    additionalTerms: string | null;
}

export type UpdateOfferRequest =
    Omit<CreateOfferRequest, "applicationId">;