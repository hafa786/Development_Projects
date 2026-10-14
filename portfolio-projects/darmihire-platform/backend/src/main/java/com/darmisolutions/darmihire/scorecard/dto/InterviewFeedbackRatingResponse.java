package com.darmisolutions.darmihire.scorecard.dto;

import java.util.UUID;

public record InterviewFeedbackRatingResponse(

        UUID id,

        UUID criterionId,

        String criterionName,

        String criterionDescription,

        int sortOrder,

        boolean required,

        int weight,

        int rating,

        String comments

) {
}