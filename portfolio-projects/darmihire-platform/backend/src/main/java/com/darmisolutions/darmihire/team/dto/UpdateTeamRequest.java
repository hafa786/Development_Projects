package com.darmisolutions.darmihire.team.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateTeamRequest(
        @NotBlank String name,
        String description
) {}