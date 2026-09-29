package com.darmisolutions.darmihire.tenant.dto;

import com.darmisolutions.darmihire.tenant.Role;

import java.util.UUID;

public record UserTenantResponse(
        UUID id,
        String name,
        String slug,
        Role role
) {
}