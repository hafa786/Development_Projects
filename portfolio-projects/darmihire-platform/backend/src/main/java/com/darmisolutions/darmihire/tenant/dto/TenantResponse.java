package com.darmisolutions.darmihire.tenant.dto;

import java.util.UUID;

public record TenantResponse(

        UUID id,

        String name,

        String slug,

        String logoUrl,

        boolean active

) {
}