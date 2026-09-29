package com.darmisolutions.darmihire.location.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateLocationRequest(
        @NotBlank String name,
        String city,
        String country,
        String timezone,
        boolean remote
) {}