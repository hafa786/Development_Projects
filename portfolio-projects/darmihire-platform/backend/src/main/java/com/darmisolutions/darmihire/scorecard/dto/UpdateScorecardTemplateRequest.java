package com.darmisolutions.darmihire.scorecard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateScorecardTemplateRequest(
    @NotBlank @Size(max = 200) String name, String description) {}
