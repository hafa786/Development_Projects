package com.darmisolutions.darmihire.team.dto;

import java.util.UUID;

public record TeamResponse(
        UUID id,
        String name,
        String description
) {
}