package com.darmisolutions.darmihire.application.dto;

import com.darmisolutions.darmihire.application.ApplicationStage;
import com.darmisolutions.darmihire.application.ApplicationStatus;

import java.time.Instant;
import java.util.UUID;

public record JobApplicationResponse(

    UUID id,

    UUID jobId,
    String jobTitle,
    String jobCode,

    UUID candidateId,
    String candidateFirstName,
    String candidateLastName,
    String candidateFullName,
    String candidateEmail,
    String candidatePhone,
    String candidateLocation,

    ApplicationStage stage,
    ApplicationStatus status,

    Instant appliedAt,

    Instant rejectedAt,
    String rejectionReason,

    Instant withdrawnAt,
    Instant hiredAt,

    Instant createdAt,
    Instant updatedAt

) {}