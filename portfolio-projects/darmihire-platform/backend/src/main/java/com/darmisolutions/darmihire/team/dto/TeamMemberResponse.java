package com.darmisolutions.darmihire.team.dto;

import java.util.UUID;

public record TeamMemberResponse(
        UUID tenantUserId
) {
}