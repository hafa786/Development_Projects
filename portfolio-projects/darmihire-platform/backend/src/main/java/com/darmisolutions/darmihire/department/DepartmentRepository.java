package com.darmisolutions.darmihire.department;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {

  List<Department> findAllByTenantIdOrderByName(UUID tenantId);

  Optional<Department> findByIdAndTenantId(UUID id, UUID tenantId);

  boolean existsByTenantIdAndNameIgnoreCase(UUID tenantId, String name);
}
