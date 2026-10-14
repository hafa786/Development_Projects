package com.darmisolutions.darmihire.scorecard.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateScorecardCriterionRequest(

        @NotBlank
        @Size(max = 200)
        String name,

        String description,

        @NotNull
        @Min(0)
        Integer sortOrder,

        @NotNull
        Boolean required,

        @NotNull
        @Min(1)
        @Max(100)
        Integer weight

) {
}