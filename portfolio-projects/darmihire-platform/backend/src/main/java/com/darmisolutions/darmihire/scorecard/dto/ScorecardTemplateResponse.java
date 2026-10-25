package com.darmisolutions.darmihire.scorecard.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ScorecardTemplateResponse(
    UUID id,
    String name,
    String description,
    boolean active,
    List<ScorecardCriterionResponse> criteria,
    Instant createdAt,
    Instant updatedAt) {}
