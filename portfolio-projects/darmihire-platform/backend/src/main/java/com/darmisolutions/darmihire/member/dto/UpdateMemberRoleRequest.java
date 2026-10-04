package com.darmisolutions.darmihire.member.dto;

import com.darmisolutions.darmihire.tenant.Role;
import jakarta.validation.constraints.NotNull;

public record UpdateMemberRoleRequest(

        @NotNull
        Role role

) {
}