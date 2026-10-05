package com.darmisolutions.darmihire.invitation;

import com.darmisolutions.darmihire.invitation.dto.CreateInvitationRequest;
import com.darmisolutions.darmihire.invitation.dto.CreateInvitationResponse;
import com.darmisolutions.darmihire.invitation.dto.InvitationDetailsResponse;
import com.darmisolutions.darmihire.invitation.dto.InvitationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/invitations")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService invitationService;

    /*
     * ---------------------------------------------------------
     * GET ALL INVITATIONS
     * ---------------------------------------------------------
     *
     * GET /api/v1/invitations
     */

    @GetMapping
    public List<InvitationResponse> findAll() {

        return invitationService.findAll();
    }

    /*
     * ---------------------------------------------------------
     * CREATE INVITATION
     * ---------------------------------------------------------
     *
     * POST /api/v1/invitations
     */

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateInvitationResponse create(
            @Valid @RequestBody CreateInvitationRequest request) {

        InvitationService.CreatedInvitation created =
                invitationService.create(request);

        return new CreateInvitationResponse(
                created.invitation(),
                created.token()
        );
    }

    /*
     * ---------------------------------------------------------
     * GET INVITATION DETAILS
     * ---------------------------------------------------------
     *
     * GET /api/v1/invitations/token/{token}
     */

    @GetMapping("/token/{token}")
    public InvitationDetailsResponse findByToken(
            @PathVariable String token) {

        return invitationService.findByToken(
                token
        );
    }

    /*
     * ---------------------------------------------------------
     * ACCEPT INVITATION
     * ---------------------------------------------------------
     *
     * POST /api/v1/invitations/token/{token}/accept
     */

    @PostMapping("/token/{token}/accept")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void accept(
            @PathVariable String token) {

        invitationService.accept(
                token
        );
    }

    /*
     * ---------------------------------------------------------
     * CANCEL INVITATION
     * ---------------------------------------------------------
     *
     * DELETE /api/v1/invitations/{invitationId}
     */

    @DeleteMapping("/{invitationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(
            @PathVariable UUID invitationId) {

        invitationService.cancel(
                invitationId
        );
    }
}