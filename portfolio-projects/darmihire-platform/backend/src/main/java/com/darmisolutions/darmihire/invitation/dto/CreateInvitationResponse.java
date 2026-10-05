package com.darmisolutions.darmihire.invitation.dto;

public record CreateInvitationResponse(

        InvitationResponse invitation,

        String token

) {
}