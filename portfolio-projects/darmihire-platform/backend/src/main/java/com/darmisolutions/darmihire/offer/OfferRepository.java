package com.darmisolutions.darmihire.offer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OfferRepository
        extends JpaRepository<Offer, UUID> {

    Optional<Offer>
    findByIdAndTenantId(
            UUID id,
            UUID tenantId
    );

    List<Offer>
    findAllByTenantIdOrderByCreatedAtDesc(
            UUID tenantId
    );

    List<Offer>
    findAllByTenantIdAndApplicationIdOrderByCreatedAtDesc(
            UUID tenantId,
            UUID applicationId
    );

    List<Offer>
    findAllByTenantIdAndStatusOrderByCreatedAtDesc(
            UUID tenantId,
            OfferStatus status
    );

    boolean
    existsByTenantIdAndApplicationIdAndStatus(
            UUID tenantId,
            UUID applicationId,
            OfferStatus status
    );
}