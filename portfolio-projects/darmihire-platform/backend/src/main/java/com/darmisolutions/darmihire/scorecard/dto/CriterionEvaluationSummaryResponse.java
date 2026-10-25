package com.darmisolutions.darmihire.scorecard.dto;

import java.util.UUID;

public record CriterionEvaluationSummaryResponse(
    UUID criterionId, String criterionName, double averageRating, int responseCount, int weight) {}
