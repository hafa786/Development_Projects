package com.darmisolutions.darmihire.team.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateTeamRequest(
        @NotBlank String name,
        String description
) {
}