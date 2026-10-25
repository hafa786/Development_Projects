package com.darmisolutions.darmihire.scorecard.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateScorecardTemplateRequest(
    @NotBlank @Size(max = 200) String name,
    String description,
    @Valid List<CreateScorecardCriterionRequest> criteria) {}
