package com.darmisolutions.darmihire.auth.dto;

import java.util.UUID;

public record UserRegistrationResponse(
        UUID id,
        String firstName,
        String lastName,
        String email
) {
}