package com.darmisolutions.darmihire.scorecard.dto;

import java.util.List;
import java.util.UUID;

public record InterviewEvaluationSummaryResponse(
    UUID interviewId,
    String interviewTitle,
    double weightedScore,
    int submittedFeedbackCount,
    List<InterviewerEvaluationResponse> interviewers) {}
