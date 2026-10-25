package com.darmisolutions.darmihire.tenant;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {

  Optional<Tenant> findBySlug(String slug);

  boolean existsBySlug(String slug);

  Optional<Tenant> findBySlugIgnoreCase(String slug);

  boolean existsBySlugIgnoreCase(String slug);
}
