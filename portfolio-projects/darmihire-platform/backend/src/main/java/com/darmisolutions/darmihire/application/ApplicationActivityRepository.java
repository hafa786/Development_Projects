package com.darmisolutions.darmihire.application;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationActivityRepository extends JpaRepository<ApplicationActivity, UUID> {

  List<ApplicationActivity> findAllByTenantIdAndApplicationIdOrderByCreatedAtAsc(
      UUID tenantId, UUID applicationId);
}
