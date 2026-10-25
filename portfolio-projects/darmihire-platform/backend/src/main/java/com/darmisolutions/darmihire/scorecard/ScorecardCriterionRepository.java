package com.darmisolutions.darmihire.scorecard;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScorecardCriterionRepository extends JpaRepository<ScorecardCriterion, UUID> {

  List<ScorecardCriterion> findAllByTenantIdAndTemplateIdOrderBySortOrderAsc(
      UUID tenantId, UUID templateId);

  Optional<ScorecardCriterion> findByIdAndTenantId(UUID id, UUID tenantId);

  boolean existsByTenantIdAndTemplateIdAndNameIgnoreCase(
      UUID tenantId, UUID templateId, String name);
}
