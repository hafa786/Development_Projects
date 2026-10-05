package com.darmisolutions.darmihire.invitation.dto;

import com.darmisolutions.darmihire.invitation.InvitationStatus;
import com.darmisolutions.darmihire.tenant.Role;

import java.time.Instant;
import java.util.UUID;

public record InvitationResponse(

        UUID id,

        String email,

        Role role,

        InvitationStatus status,

        Instant expiresAt,

        Instant createdAt

) {
}