package com.darmisolutions.darmihire.location;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, UUID> {

  List<Location> findAllByTenantIdOrderByName(UUID tenantId);

  Optional<Location> findByIdAndTenantId(UUID id, UUID tenantId);
}
