package com.darmisolutions.darmihire.scorecard.dto;

import com.darmisolutions.darmihire.scorecard.HiringRecommendation;

import java.time.Instant;
import java.util.UUID;

public record InterviewerEvaluationResponse(
        UUID feedbackId,
        UUID interviewId,
        UUID interviewerId,
        String interviewerName,
        HiringRecommendation recommendation,
        double weightedScore,
        Instant submittedAt
) {
}