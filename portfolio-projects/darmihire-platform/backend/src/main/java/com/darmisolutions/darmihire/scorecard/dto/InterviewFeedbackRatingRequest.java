package com.darmisolutions.darmihire.scorecard.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record InterviewFeedbackRatingRequest(

        @NotNull
        UUID criterionId,

        @NotNull
        @Min(1)
        @Max(5)
        Integer rating,

        String comments

) {
}