package com.darmisolutions.darmihire.offer.dto;

import com.darmisolutions.darmihire.job.EmploymentType;
import com.darmisolutions.darmihire.offer.OfferStatus;
import com.darmisolutions.darmihire.offer.SalaryPeriod;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record OfferResponse(
    UUID id,
    UUID applicationId,
    UUID candidateId,
    String candidateName,
    UUID jobId,
    String jobTitle,
    OfferStatus status,
    BigDecimal salary,
    String currency,
    SalaryPeriod salaryPeriod,
    EmploymentType employmentType,
    LocalDate startDate,
    LocalDate expirationDate,
    String probationPeriod,
    String benefits,
    String additionalTerms,
    UUID createdById,
    String createdByName,
    UUID approvedById,
    String approvedByName,
    Instant submittedForApprovalAt,
    Instant approvedAt,
    Instant rejectedAt,
    Instant sentAt,
    Instant acceptedAt,
    Instant declinedAt,
    Instant withdrawnAt,
    String rejectionReason,
    String declineReason,
    String withdrawalReason,
    Instant createdAt,
    Instant updatedAt) {}
