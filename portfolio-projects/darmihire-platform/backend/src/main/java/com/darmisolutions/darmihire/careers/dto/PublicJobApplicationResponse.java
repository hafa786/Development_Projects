package com.darmisolutions.darmihire.careers.dto;

import java.time.Instant;
import java.util.UUID;

public record PublicJobApplicationResponse(
        UUID applicationId,
        String jobTitle,
        String candidateName,
        Instant appliedAt,
        String message) {
}