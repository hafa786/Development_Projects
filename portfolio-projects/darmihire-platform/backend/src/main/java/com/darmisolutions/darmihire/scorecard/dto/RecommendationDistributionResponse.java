package com.darmisolutions.darmihire.scorecard.dto;

public record RecommendationDistributionResponse(
        int strongNo,
        int no,
        int neutral,
        int yes,
        int strongYes
) {
}