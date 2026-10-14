package com.darmisolutions.darmihire.scorecard.dto;

import java.time.Instant;
import java.util.UUID;

public record ScorecardCriterionResponse(

        UUID id,

        String name,

        String description,

        int sortOrder,

        boolean required,

        int weight,

        Instant createdAt,

        Instant updatedAt

) {
}