package com.darmisolutions.darmihire.invitation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvitationRepository
        extends JpaRepository<Invitation, UUID> {

    List<Invitation> findAllByTenantIdOrderByCreatedAtDesc(
            UUID tenantId
    );

    Optional<Invitation> findByIdAndTenantId(
            UUID id,
            UUID tenantId
    );

    Optional<Invitation> findByTokenHash(
            String tokenHash
    );

    boolean existsByTenantIdAndEmailIgnoreCaseAndStatus(
            UUID tenantId,
            String email,
            InvitationStatus status
    );
}