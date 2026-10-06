package com.darmisolutions.darmihire.job;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JobRepository
        extends JpaRepository<Job, UUID> {

    List<Job> findAllByTenantIdOrderByCreatedAtDesc(
            UUID tenantId
    );

    Optional<Job> findByIdAndTenantId(
            UUID id,
            UUID tenantId
    );

    boolean existsByTenantIdAndJobCodeIgnoreCase(
            UUID tenantId,
            String jobCode
    );
}