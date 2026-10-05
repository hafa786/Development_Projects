package com.darmisolutions.darmihire.invitation;

import com.darmisolutions.darmihire.exception.ConflictException;
import com.darmisolutions.darmihire.exception.ResourceNotFoundException;
import com.darmisolutions.darmihire.invitation.dto.CreateInvitationRequest;
import com.darmisolutions.darmihire.invitation.dto.InvitationDetailsResponse;
import com.darmisolutions.darmihire.invitation.dto.InvitationResponse;
import com.darmisolutions.darmihire.security.AuthorizationService;
import com.darmisolutions.darmihire.security.Permission;
import com.darmisolutions.darmihire.tenant.MembershipStatus;
import com.darmisolutions.darmihire.tenant.Tenant;
import com.darmisolutions.darmihire.tenant.TenantRepository;
import com.darmisolutions.darmihire.tenant.TenantUser;
import com.darmisolutions.darmihire.tenant.TenantUserRepository;
import com.darmisolutions.darmihire.tenant.context.TenantContext;
import com.darmisolutions.darmihire.user.User;
import com.darmisolutions.darmihire.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvitationService {

    private static final int EXPIRATION_DAYS = 7;

    private final InvitationRepository invitationRepository;

    private final TenantRepository tenantRepository;

    private final TenantUserRepository tenantUserRepository;

    private final UserRepository userRepository;

    private final TenantContext tenantContext;

    private final AuthorizationService authorizationService;

    private final SecureRandom secureRandom =
            new SecureRandom();

    /*
     * ---------------------------------------------------------
     * FIND ALL INVITATIONS
     * ---------------------------------------------------------
     */

    @Transactional(readOnly = true)
    public List<InvitationResponse> findAll() {

        authorizationService.require(
                Permission.MANAGE_USERS
        );

        UUID tenantId = requireTenantId();

        return invitationRepository
                .findAllByTenantIdOrderByCreatedAtDesc(
                        tenantId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /*
     * ---------------------------------------------------------
     * CREATE INVITATION
     * ---------------------------------------------------------
     */

    @Transactional
    public CreatedInvitation create(
            CreateInvitationRequest request) {

        authorizationService.require(
                Permission.MANAGE_USERS
        );

        UUID tenantId = requireTenantId();

        User currentUser =
                requireCurrentUser();

        String email =
                normalizeEmail(
                        request.email()
                );

        /*
         * -----------------------------------------------------
         * CHECK EXISTING WORKSPACE MEMBER
         * -----------------------------------------------------
         */

        User existingUser =
                userRepository
                        .findByEmailIgnoreCase(
                                email
                        )
                        .orElse(null);

        if (existingUser != null &&
                tenantUserRepository
                        .existsByTenantIdAndUserId(
                                tenantId,
                                existingUser.getId()
                        )) {

            throw new ConflictException(
                    "This user is already a workspace member"
            );
        }

        /*
         * -----------------------------------------------------
         * CHECK EXISTING PENDING INVITATION
         * -----------------------------------------------------
         */

        boolean pendingInvitationExists =
                invitationRepository
                        .existsByTenantIdAndEmailIgnoreCaseAndStatus(
                                tenantId,
                                email,
                                InvitationStatus.PENDING
                        );

        if (pendingInvitationExists) {

            throw new ConflictException(
                    "A pending invitation already exists for this email"
            );
        }

        /*
         * -----------------------------------------------------
         * FIND TENANT
         * -----------------------------------------------------
         */

        Tenant tenant =
                tenantRepository
                        .findById(
                                tenantId
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Tenant not found"
                                        )
                        );

        /*
         * -----------------------------------------------------
         * GENERATE TOKEN
         * -----------------------------------------------------
         */

        String rawToken =
                generateToken();

        /*
         * -----------------------------------------------------
         * CREATE INVITATION
         * -----------------------------------------------------
         */

        Invitation invitation =
                new Invitation();

        invitation.setTenant(
                tenant
        );

        invitation.setEmail(
                email
        );

        invitation.setRole(
                request.role()
        );

        invitation.setTokenHash(
                hashToken(
                        rawToken
                )
        );

        invitation.setStatus(
                InvitationStatus.PENDING
        );

        invitation.setInvitedBy(
                currentUser
        );

        invitation.setExpiresAt(
                Instant.now()
                        .plus(
                                EXPIRATION_DAYS,
                                ChronoUnit.DAYS
                        )
        );

        Invitation savedInvitation =
                invitationRepository.save(
                        invitation
                );

        /*
         * The raw token is returned only once.
         *
         * When email delivery is implemented,
         * the backend should email this token
         * and stop returning it to the client.
         */

        return new CreatedInvitation(
                toResponse(
                        savedInvitation
                ),
                rawToken
        );
    }

    /*
     * ---------------------------------------------------------
     * GET INVITATION DETAILS BY TOKEN
     * ---------------------------------------------------------
     */

    @Transactional
    public InvitationDetailsResponse findByToken(
            String rawToken) {

        Invitation invitation =
                findPendingInvitation(
                        rawToken
                );

        return new InvitationDetailsResponse(
                invitation.getEmail(),
                invitation
                        .getTenant()
                        .getName(),
                invitation.getRole(),
                invitation.getExpiresAt()
        );
    }

    /*
     * ---------------------------------------------------------
     * ACCEPT INVITATION
     * ---------------------------------------------------------
     */

    @Transactional
    public void accept(
            String rawToken) {

        Invitation invitation =
                findPendingInvitation(
                        rawToken
                );

        User currentUser =
                requireCurrentUser();

        /*
         * An invitation can only be accepted by
         * the account whose email was invited.
         */

        if (!currentUser
                .getEmail()
                .equalsIgnoreCase(
                        invitation.getEmail()
                )) {

            throw new AccessDeniedException(
                    "This invitation belongs to another email address"
            );
        }

        UUID tenantId =
                invitation
                        .getTenant()
                        .getId();

        /*
         * Prevent duplicate tenant membership.
         */

        if (tenantUserRepository
                .existsByTenantIdAndUserId(
                        tenantId,
                        currentUser.getId()
                )) {

            throw new ConflictException(
                    "You are already a member of this workspace"
            );
        }

        /*
         * -----------------------------------------------------
         * CREATE ACTIVE TENANT MEMBERSHIP
         * -----------------------------------------------------
         */

        TenantUser membership =
                new TenantUser();

        membership.setTenant(
                invitation.getTenant()
        );

        membership.setUser(
                currentUser
        );

        membership.setRole(
                invitation.getRole()
        );

        membership.setStatus(
                MembershipStatus.ACTIVE
        );

        membership.setJoinedAt(
                Instant.now()
        );

        tenantUserRepository.save(
                membership
        );

        /*
         * -----------------------------------------------------
         * MARK INVITATION ACCEPTED
         * -----------------------------------------------------
         */

        invitation.setStatus(
                InvitationStatus.ACCEPTED
        );

        invitation.setAcceptedAt(
                Instant.now()
        );

        invitationRepository.save(
                invitation
        );
    }

    /*
     * ---------------------------------------------------------
     * CANCEL INVITATION
     * ---------------------------------------------------------
     */

    @Transactional
    public void cancel(
            UUID invitationId) {

        authorizationService.require(
                Permission.MANAGE_USERS
        );

        UUID tenantId =
                requireTenantId();

        Invitation invitation =
                invitationRepository
                        .findByIdAndTenantId(
                                invitationId,
                                tenantId
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Invitation not found"
                                        )
                        );

        if (invitation.getStatus()
                != InvitationStatus.PENDING) {

            throw new ConflictException(
                    "Only pending invitations can be cancelled"
            );
        }

        invitation.setStatus(
                InvitationStatus.CANCELLED
        );

        invitationRepository.save(
                invitation
        );
    }

    /*
     * ---------------------------------------------------------
     * FIND PENDING INVITATION
     * ---------------------------------------------------------
     */

    private Invitation findPendingInvitation(
            String rawToken) {

        if (rawToken == null ||
                rawToken.isBlank()) {

            throw new ResourceNotFoundException(
                    "Invitation not found"
            );
        }

        Invitation invitation =
                invitationRepository
                        .findByTokenHash(
                                hashToken(
                                        rawToken
                                )
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Invitation not found"
                                        )
                        );

        if (invitation.getStatus()
                != InvitationStatus.PENDING) {

            throw new ConflictException(
                    "This invitation is no longer active"
            );
        }

        /*
         * Mark an expired invitation as EXPIRED
         * when it is accessed.
         */

        if (invitation
                .getExpiresAt()
                .isBefore(
                        Instant.now()
                )) {

            invitation.setStatus(
                    InvitationStatus.EXPIRED
            );

            invitationRepository.save(
                    invitation
            );

            throw new ConflictException(
                    "This invitation has expired"
            );
        }

        return invitation;
    }

    /*
     * ---------------------------------------------------------
     * REQUIRE CURRENT TENANT
     * ---------------------------------------------------------
     */

    private UUID requireTenantId() {

        UUID tenantId =
                tenantContext.getTenantId();

        if (tenantId == null) {

            throw new IllegalStateException(
                    "Tenant context is required"
            );
        }

        return tenantId;
    }

    /*
     * ---------------------------------------------------------
     * REQUIRE CURRENT USER
     * ---------------------------------------------------------
     */

    private User requireCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new AccessDeniedException(
                    "Authentication is required"
            );
        }

        String email =
                authentication.getName();

        if (email == null ||
                email.isBlank()) {

            throw new AccessDeniedException(
                    "Authenticated user is unavailable"
            );
        }

        return userRepository
                .findByEmailIgnoreCase(
                        email
                )
                .orElseThrow(
                        () ->
                                new ResourceNotFoundException(
                                        "Authenticated user not found"
                                )
                );
    }

    /*
     * ---------------------------------------------------------
     * NORMALIZE EMAIL
     * ---------------------------------------------------------
     */

    private String normalizeEmail(
            String email) {

        return email
                .trim()
                .toLowerCase();
    }

    /*
     * ---------------------------------------------------------
     * GENERATE INVITATION TOKEN
     * ---------------------------------------------------------
     */

    private String generateToken() {

        byte[] bytes =
                new byte[32];

        secureRandom.nextBytes(
                bytes
        );

        return Base64
                .getUrlEncoder()
                .withoutPadding()
                .encodeToString(
                        bytes
                );
    }

    /*
     * ---------------------------------------------------------
     * HASH INVITATION TOKEN
     * ---------------------------------------------------------
     */

    private String hashToken(
            String rawToken) {

        try {

            MessageDigest digest =
                    MessageDigest
                            .getInstance(
                                    "SHA-256"
                            );

            byte[] hash =
                    digest.digest(
                            rawToken.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            return HexFormat
                    .of()
                    .formatHex(
                            hash
                    );

        } catch (
                NoSuchAlgorithmException exception
        ) {

            throw new IllegalStateException(
                    "SHA-256 is not available",
                    exception
            );
        }
    }

    /*
     * ---------------------------------------------------------
     * INVITATION RESPONSE
     * ---------------------------------------------------------
     */

    private InvitationResponse toResponse(
            Invitation invitation) {

        return new InvitationResponse(
                invitation.getId(),
                invitation.getEmail(),
                invitation.getRole(),
                invitation.getStatus(),
                invitation.getExpiresAt(),
                invitation.getCreatedAt()
        );
    }

    /*
     * ---------------------------------------------------------
     * INTERNAL CREATE RESULT
     * ---------------------------------------------------------
     */

    public record CreatedInvitation(

            InvitationResponse invitation,

            String token

    ) {
    }
}