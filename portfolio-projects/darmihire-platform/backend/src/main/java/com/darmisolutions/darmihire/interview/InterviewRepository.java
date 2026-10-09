package com.darmisolutions.darmihire.interview;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InterviewRepository
    extends JpaRepository<Interview, UUID> {

    List<Interview>
        findAllByTenantIdOrderByStartTimeDesc(
            UUID tenantId
        );

    List<Interview>
        findAllByTenantIdAndApplicationIdOrderByStartTimeAsc(
            UUID tenantId,
            UUID applicationId
        );

    Optional<Interview>
        findByIdAndTenantId(
            UUID id,
            UUID tenantId
        );

    List<Interview>
        findAllByTenantIdAndStartTimeBetweenOrderByStartTimeAsc(
            UUID tenantId,
            Instant start,
            Instant end
        );
}