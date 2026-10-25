package com.darmisolutions.darmihire.scorecard.dto;

import java.util.List;
import java.util.UUID;

public record ApplicationEvaluationSummaryResponse(
    UUID applicationId,
    double weightedScore,
    int submittedFeedbackCount,
    RecommendationDistributionResponse recommendations,
    List<CriterionEvaluationSummaryResponse> criteria,
    List<InterviewEvaluationSummaryResponse> interviews) {}
