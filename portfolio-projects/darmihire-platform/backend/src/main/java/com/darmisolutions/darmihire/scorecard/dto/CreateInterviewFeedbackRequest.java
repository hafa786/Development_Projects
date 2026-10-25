package com.darmisolutions.darmihire.scorecard.dto;

import com.darmisolutions.darmihire.scorecard.HiringRecommendation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record CreateInterviewFeedbackRequest(
    @NotNull UUID interviewId,
    @NotNull UUID templateId,
    HiringRecommendation recommendation,
    String overallComments,
    String strengths,
    String concerns,
    @Valid List<InterviewFeedbackRatingRequest> ratings) {}
