package com.darmisolutions.darmihire.job;

import org.springframework.data.jpa.repository.JpaRepository;

import com.darmisolutions.darmihire.tenant.Tenant;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JobRepository
                extends JpaRepository<Job, UUID> {

        List<Job> findAllByTenantIdOrderByCreatedAtDesc(
                        UUID tenantId);

        Optional<Job> findByIdAndTenantId(
                        UUID id,
                        UUID tenantId);

        boolean existsByTenantIdAndJobCodeIgnoreCase(
                        UUID tenantId,
                        String jobCode);

        Optional<Job> findByTenantIdAndPublicSlug(
                        UUID tenantId,
                        String publicSlug);

        boolean existsByTenantIdAndPublicSlug(
                        UUID tenantId,
                        String publicSlug);

        List<Job> findAllByTenantIdAndPublishedTrueAndStatusOrderByCreatedAtDesc(
                        UUID tenantId,
                        JobStatus status);

        Optional<Job> findByTenantIdAndPublicSlugAndPublishedTrueAndStatus(UUID id, String normalizeSlug,
                JobStatus open);

}