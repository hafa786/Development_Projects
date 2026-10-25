package com.darmisolutions.darmihire.candidate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate, UUID> {

  List<Candidate> findAllByTenantIdOrderByCreatedAtDesc(UUID tenantId);

  Optional<Candidate> findByIdAndTenantId(UUID id, UUID tenantId);

  Optional<Candidate> findByTenantIdAndEmailIgnoreCase(UUID tenantId, String email);

  boolean existsByTenantIdAndEmailIgnoreCase(UUID tenantId, String email);

  boolean existsByTenantIdAndEmailIgnoreCaseAndIdNot(UUID tenantId, String email, UUID id);
}
