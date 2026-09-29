package com.darmisolutions.darmihire.location.dto;

import java.util.UUID;

public record LocationResponse(
        UUID id,
        String name,
        String city,
        String country,
        String timezone,
        boolean remote
) {}