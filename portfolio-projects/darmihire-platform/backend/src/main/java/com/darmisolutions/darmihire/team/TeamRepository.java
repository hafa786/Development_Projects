package com.darmisolutions.darmihire.team;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, UUID> {

  List<Team> findAllByTenantIdOrderByName(UUID tenantId);

  Optional<Team> findByIdAndTenantId(UUID id, UUID tenantId);

  boolean existsByTenantIdAndNameIgnoreCase(UUID tenantId, String name);
}
