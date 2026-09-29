package com.darmisolutions.darmihire.team.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AddTeamMemberRequest(
        @NotNull UUID tenantUserId
) {}