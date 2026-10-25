package com.darmisolutions.darmihire.scorecard.dto;

import com.darmisolutions.darmihire.scorecard.HiringRecommendation;
import jakarta.validation.Valid;
import java.util.List;

public record UpdateInterviewFeedbackRequest(
    HiringRecommendation recommendation,
    String overallComments,
    String strengths,
    String concerns,
    @Valid List<InterviewFeedbackRatingRequest> ratings) {}
