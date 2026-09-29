package com.darmisolutions.darmihire.invitation.dto;

import jakarta.validation.constraints.NotBlank;

public record AcceptInvitationRequest(
        @NotBlank String token
) {}