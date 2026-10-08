package com.darmisolutions.darmihire.candidate.dto;

import com.darmisolutions.darmihire.candidate.CandidateSource;

import java.time.Instant;
import java.util.UUID;

public record CandidateResponse(
    UUID id,
    String firstName,
    String lastName,
    String fullName,
    String email,
    String phone,
    String location,
    String linkedinUrl,
    String portfolioUrl,
    CandidateSource source,
    String resumeFileName,
    String resumeUrl,
    String notes,
    Instant createdAt,
    Instant updatedAt
) {}