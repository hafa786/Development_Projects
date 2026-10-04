package com.darmisolutions.darmihire.member.dto;

import com.darmisolutions.darmihire.tenant.MembershipStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateMemberStatusRequest(

        @NotNull
        MembershipStatus status

) {
}