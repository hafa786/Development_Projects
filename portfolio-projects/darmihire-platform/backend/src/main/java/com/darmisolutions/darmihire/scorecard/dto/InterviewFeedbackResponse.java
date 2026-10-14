package com.darmisolutions.darmihire.scorecard.dto;

import com.darmisolutions.darmihire.scorecard.HiringRecommendation;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record InterviewFeedbackResponse(

        UUID id,

        UUID interviewId,

        UUID applicationId,

        UUID interviewerId,

        String interviewerName,

        UUID templateId,

        String templateName,

        HiringRecommendation recommendation,

        String overallComments,

        String strengths,

        String concerns,

        boolean submitted,

        Instant submittedAt,

        List<InterviewFeedbackRatingResponse> ratings,

        Instant createdAt,

        Instant updatedAt

) {
}