package com.darmisolutions.darmihire.tenant;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantUserRepository extends JpaRepository<TenantUser, UUID> {

  Optional<TenantUser> findByTenantIdAndUserId(UUID tenantId, UUID userId);

  Optional<TenantUser> findByIdAndTenantId(UUID id, UUID tenantId);

  List<TenantUser> findAllByTenantId(UUID tenantId);

  List<TenantUser> findAllByUserId(UUID userId);

  List<TenantUser> findAllByUserIdAndStatus(UUID userId, MembershipStatus status);

  boolean existsByTenantIdAndUserId(UUID tenantId, UUID userId);
}
