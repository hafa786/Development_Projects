package com.darmisolutions.darmihire.application;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

  List<JobApplication> findAllByTenantIdOrderByCreatedAtDesc(UUID tenantId);

  List<JobApplication> findAllByTenantIdAndJobIdOrderByCreatedAtDesc(UUID tenantId, UUID jobId);

  List<JobApplication> findAllByTenantIdAndCandidateIdOrderByCreatedAtDesc(
      UUID tenantId, UUID candidateId);

  Optional<JobApplication> findByIdAndTenantId(UUID id, UUID tenantId);

  boolean existsByTenantIdAndJobIdAndCandidateId(UUID tenantId, UUID jobId, UUID candidateId);
}
