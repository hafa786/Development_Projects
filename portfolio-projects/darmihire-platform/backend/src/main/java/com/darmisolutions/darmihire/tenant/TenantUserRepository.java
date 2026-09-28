package com.darmisolutions.darmihire.tenant;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TenantUserRepository
        extends JpaRepository<TenantUser, UUID> {

    Optional<TenantUser> findByTenantIdAndUserId(
            UUID tenantId,
            UUID userId
    );

    List<TenantUser> findAllByTenantId(
            UUID tenantId
    );

    List<TenantUser> findAllByUserId(
            UUID userId
    );

    boolean existsByTenantIdAndUserId(
            UUID tenantId,
            UUID userId
    );
}