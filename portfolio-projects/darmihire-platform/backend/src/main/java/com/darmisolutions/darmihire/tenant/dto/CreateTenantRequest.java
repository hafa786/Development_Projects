package com.darmisolutions.darmihire.tenant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateTenantRequest(

        @NotBlank
        @Size(max = 255)
        String name,

        @NotBlank
        @Size(max = 100)
        @Pattern(
                regexp = "^[a-z0-9-]+$",
                message =
                        "Slug can contain only lowercase letters, numbers and hyphens"
        )
        String slug

) {
}