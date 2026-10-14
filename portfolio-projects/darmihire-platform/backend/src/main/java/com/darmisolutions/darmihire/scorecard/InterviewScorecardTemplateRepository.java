package com.darmisolutions.darmihire.scorecard;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InterviewScorecardTemplateRepository
        extends JpaRepository<
                InterviewScorecardTemplate,
                UUID
        > {

    List<InterviewScorecardTemplate>
    findAllByTenantIdOrderByNameAsc(
            UUID tenantId
    );

    List<InterviewScorecardTemplate>
    findAllByTenantIdAndActiveTrueOrderByNameAsc(
            UUID tenantId
    );

    Optional<InterviewScorecardTemplate>
    findByIdAndTenantId(
            UUID id,
            UUID tenantId
    );

    boolean existsByTenantIdAndNameIgnoreCase(
            UUID tenantId,
            String name
    );

    boolean existsByTenantIdAndNameIgnoreCaseAndIdNot(
            UUID tenantId,
            String name,
            UUID id
    );
}