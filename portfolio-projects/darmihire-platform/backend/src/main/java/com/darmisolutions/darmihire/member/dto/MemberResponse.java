package com.darmisolutions.darmihire.member.dto;

import com.darmisolutions.darmihire.tenant.MembershipStatus;
import com.darmisolutions.darmihire.tenant.Role;

import java.time.Instant;
import java.util.UUID;

public record MemberResponse(

        UUID tenantUserId,

        UUID userId,

        String email,

        String firstName,

        String lastName,

        Role role,

        MembershipStatus status,

        Instant joinedAt,

        boolean active

) {
}