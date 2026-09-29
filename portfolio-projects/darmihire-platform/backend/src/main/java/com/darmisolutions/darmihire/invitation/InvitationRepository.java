package com.darmisolutions.darmihire.invitation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InvitationRepository
        extends JpaRepository<Invitation, UUID> {

    Optional<Invitation> findByTokenHash(
            String tokenHash
    );

    boolean existsByTenantIdAndEmailIgnoreCaseAndStatus(
            UUID tenantId,
            String email,
            InvitationStatus status
    );
}