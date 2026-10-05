package com.darmisolutions.darmihire.invitation.dto;

import com.darmisolutions.darmihire.tenant.Role;

import java.time.Instant;

public record InvitationDetailsResponse(

        String email,

        String tenantName,

        Role role,

        Instant expiresAt

) {
}